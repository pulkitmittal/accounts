/**
 * @ngdoc Directives
 * @name form-for
 * @description
 * This directive should be paired with an Angular ngForm object and should contain at least one of the formFor field types described below.
 * At a high level, it operates on a bindable form-data object and runs validations each time a change is detected.
 *
 * @param {Object} controller Two way bindable attribute exposing access to the formFor controller API.
 * See below for an example of how to use this binding to access the controller.
 * @param {Boolean} disable Form is disabled.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * This attribute is 2-way bindable.
 * @param {Object} formFor An object on $scope that formFor should read and write data to.
 * It is recommended that you bind to a copied object so that you can quickly revert changes if the user cancels or if submit fails.
 * For more information refer to angular.copy.
 * @param {String} service Convenience mehtod for identifying an $injector-accessible model containing both the validation rules and submit function.
 * Validation rules should be accessible via an attribute named validationRules and the submit function should be named submit.
 * @param {Function} submitComplete Custom handler to be invoked upon a successful form submission.
 * Use this to display custom messages or do custom routing after submit.
 * This method should accept a "data" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitError Custom error handler function.
 * This function should accept an "error" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitWith Function triggered on form-submit.
 * This function should accept a named parameter data (the model object) and should return a promise to be resolved/rejected based on the result of the submission.
 * In the event of a rejection, the promise can return an error string or a map of field-names to specific errors.
 * See below for an example.
 * @param {Function} validationFailed Optional callback to be invoked whenever a form-submit is blocked due to a failed validation.
 * @param {Object} validationRules Set of client-side validation rules (keyed by form field names) to apply to form-data before submitting.
 * For more information refer to the Validation Types page.
 */
angular.module('formFor').directive('formFor',
  function($injector, $parse, $q, $sce, FormForConfiguration, $FormForStateHelper, NestedObjectHelper, ModelValidator) {
    return {
      require: 'form', // We don't need the ngForm controller, but we do rely on the form-submit hook
      restrict: 'A',
      scope: {
        controller: '=?',
        disable: '=?',
        formFor: '=',
        service: '@',
        submitComplete: '&?',
        submitError: '&?',
        submitWith: '&?',
        valid: '=?',
        validationFailed: '&?',
        validationRules: '=?'
      },
      controller: function($scope) {

        // Map of safe (bindable, $scope.$watch-able) field names to objects containing the following keys:
        // • bindableWrapper: Shared between formFor and field directives. Returned by registerFormField(). Contains:
        //   • bindable: Used for easier 2-way data binding between formFor and input field
        //   • disabled: Field should be disabled (generally because form-submission is in progress)
        //   • error: Field should display the following validation error message
        //   • pristine: Field has not been modified (or has been reset via resetErrors)
        //   • required: Informs the field's label if it should show a "required" marker
        // • fieldName: Original field name
        // • unwatchers: Array of unwatch functions to be invoked on field-unregister
        // • validationAttribute: Maps field name to the location of field validation rules
        //
        // A note on safe field names:
        // A field like 'hobbies[0].name' might be mapped to something like 'hobbies__0__name' so that we can safely $watch it.
        $scope.fields = {};

        // Maps collection names (ex. 'hobbies') to <collection-label> directives.
        // Allows formFor to mark collections as required and to display collection-level errors.
        $scope.collectionLabels = {};

        // Set of bindable wrappers used to disable buttons when form-submission is in progress.
        // Wrappers contain the following keys:
        //   • disabled: Button should be disabled (generally because form-submission is in progress)
        //
        // Note that there is no current way to associate a wrapper with a button.
        $scope.buttons = [];

        if ($scope.service) {
          $scope.$service = $injector.get($scope.service);
        }

        // Validation rules can come through 2 ways:
        // As part of the validation service or as a direct binding.
        if ($scope.$service) {
          $scope.$validationRules = $scope.$service.validationRules;
        } else {
          $scope.$validationRules = $scope.validationRules;
        }

        // Attaching controller methods to a 'controller' object instead of 'this' results in prettier JSDoc display.
        var controller = this;

        /**
         * All form-input children of formFor must register using this function.
         * @memberof form-for
         * @param {String} fieldName Unique identifier of field within model; used to map errors back to input fields
         * @return {Object} Object containing keys to be observed by the input field:
         * • bindable: Input should 2-way bind against this attribute in order to sync data with formFor.
         * • disabled: Input should disable itself if this value becomes true; typically this means the form is being submitted.
         * • error: Input should display the string contained in this field (if one exists); this means the input value is invalid.
         * • required: Input should display a 'required' indicator if this value is true.
         */
        controller.registerFormField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);
          var rules = NestedObjectHelper.readAttribute($scope.$validationRules, fieldName);

          // Store information about this field that we'll need for validation and binding purposes.
          // @see Above documentation for $scope.fields
          var fieldDatum = {
            bindableWrapper: {
              bindable: null,
              disabled: false,
              error: null,
              pristine: true,
              required: ModelValidator.isFieldRequired(fieldName, $scope.$validationRules)
            },
            fieldName: fieldName,
            unwatchers: [],
            validationAttribute: fieldName.split('[')[0] // TODO Is this needed?
          };

          $scope.fields[bindableFieldName] = fieldDatum;

          var getter = $parse(fieldName);
          var setter = getter.assign;

          // Changes made by our field should be synced back to the form-data model.
          fieldDatum.unwatchers.push(
            $scope.$watch('fields.' + bindableFieldName + '.bindableWrapper.bindable', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                setter($scope.formFor, newValue);
              }
            }));

          var formDataWatcherInitialized;

          // Changes made to the form-data model should likewise be synced to the field's bindable model.
          // (This is necessary for data that is loaded asynchronously after a form has already been displayed.)
          fieldDatum.unwatchers.push(
            $scope.$watch('formFor.' + fieldName, function(newValue, oldValue) {

              // An asynchronous formFor data source should reset any dirty flags.
              // A user tabbing in and out of a field also shouldn't be counted as dirty.
              // Easiest way to guard against this is to reset the initialization flag.
              if (newValue !== fieldDatum.bindableWrapper.bindable ||
                  oldValue === undefined && newValue === '' ||
                  newValue === undefined) {
                formDataWatcherInitialized = false;
              }

              fieldDatum.bindableWrapper.bindable = newValue;

              controller.validateField(fieldName);

              // Changes in form-data should also trigger validations.
              // Validation failures will not be displayed unless the form-field has been marked dirty (changed by user).
              // We shouldn't mark our field as dirty when Angular auto-invokes the initial watcher though,
              // So we ignore the first invocation...
              if (!formDataWatcherInitialized) {
                formDataWatcherInitialized = true;

                $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
              }

              fieldDatum.bindableWrapper.pristine = !$scope.formForStateHelper.hasFieldBeenModified(bindableFieldName);
            }));

          return fieldDatum.bindableWrapper;
        };

        /**
         * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
         * @memberof form-for
         * @param {String} fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        this.unregisterFormField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);

          angular.forEach(
            $scope.fields[bindableFieldName].unwatchers,
            function(unwatch) {
              unwatch();
            });

          delete $scope.fields[bindableFieldName];
        };

        /**
         * All submitButton children must register with formFor using this function.
         * @memberof form-for
         * @param {$scope} submitButtonScope $scope of submit button directive
         * @return {Object} Object containing keys to be observed by the input button:
         * • disabled: Button should disable itself if this value becomes true; typically this means the form is being submitted.
         */
        controller.registerSubmitButton = function(submitButtonScope) {
          var bindableWrapper = {
            disabled: false
          };

          $scope.buttons.push(bindableWrapper);

          return bindableWrapper;
        };

        /**
         * Collection headers should register themselves using this function in order to be notified of validation errors.
         * @memberof form-for
         * @param {String} fieldName Unique identifier of collection within model
         * @return {Object} Object containing keys to be observed by the input field:
         * • error: Header should display the string contained in this field (if one exists); this means the collection is invalid.
         * • required: Header should display a 'required' indicator if this value is true.
         */
        controller.registerCollectionLabel = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);

          var bindableWrapper = {
            error: null,
            required: ModelValidator.isCollectionRequired(fieldName, $scope.$validationRules)
          };

          $scope.collectionLabels[bindableFieldName] = bindableWrapper;

          var watcherInitialized = false;

          $scope.$watch('formFor.' + fieldName + '.length', function(newValue, oldValue) {
            // The initial $watch should not trigger a visible validation...
            if (!watcherInitialized) {
              watcherInitialized = true;
            } else {
              ModelValidator.validateCollection($scope.formFor, fieldName, $scope.$validationRules).then(
                function() {
                  $scope.formForStateHelper.setFieldError(bindableFieldName, null);
                },
                function(error) {
                  $scope.formForStateHelper.setFieldError(bindableFieldName, error);
                });
            }
          });

          return bindableWrapper;
        };

        /**
         * Reset validation errors for an individual field.
         * @memberof form-for
         * @param {String} fieldName Field name within formFor data object (ex. billing.address)
         */
        controller.resetField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);

          // If the field is invalid, we don't want it to appear valid- just pristing.
          if ($scope.formForStateHelper.getFieldError(bindableFieldName)) {
            $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

            $scope.fields[bindableFieldName].bindableWrapper.pristine = true;
          }

          $scope.formForStateHelper.setFieldError(bindableFieldName, null);
        };

        /**
         * Resets errors displayed on the <form> without resetting the form data values.
         * @memberof form-for
         */
        controller.resetErrors = function() {
          for (var bindableFieldName in $scope.fields) {
            // If the field is invalid, we don't want it to appear valid- just pristing.
            if ($scope.formForStateHelper.getFieldError(bindableFieldName)) {
              $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

              $scope.fields[bindableFieldName].bindableWrapper.pristine = true;
            }
          }

          $scope.formForStateHelper.setFormSubmitted(false);
          $scope.formForStateHelper.resetFieldErrors();
        };

        /**
         * Alias to resetErrors.
         * @memberof form-for
         */
        controller.resetFields = controller.resetErrors;

        /**
         * Force validation for an individual field.
         * If the field fails validation an error message will automatically be shown.
         * @memberof form-for
         * @param {String} fieldName Field name within formFor data object (ex. billing.address)
         */
        controller.validateField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);
          var fieldDatum = $scope.fields[bindableFieldName];
          var value = $parse(fieldName)($scope.formFor);

          $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);

          // Run validations and store the result keyed by our bindableFieldName for easier subsequent lookup.
          if ($scope.$validationRules) {
            ModelValidator.validateField(
                $scope.formFor,
                fieldName,
                $scope.$validationRules
              ).then(
                  function() {
                    $scope.formForStateHelper.setFieldError(bindableFieldName, null);
                  },
                  function(error) {
                    $scope.formForStateHelper.setFieldError(bindableFieldName, error);
                  });
          }
        };

        /**
         * Validate all registered form-fields.
         * This method returns a promise that is resolved or rejected with a field to error message map.
         * @memberof form-for
         */
        controller.validateForm = function() {
          // Reset errors before starting new validation.
          $scope.updateCollectionErrors({});
          $scope.updateFieldErrors({});

          var validateCollectionsPromise;
          var validateFieldsPromise;

          if ($scope.$validationRules) {
            var validationKeys = [];

            angular.forEach($scope.fields, function(field) {
              validationKeys.push(field.fieldName);
            });

            validateFieldsPromise = ModelValidator.validateFields($scope.formFor, validationKeys, $scope.$validationRules);
            validateFieldsPromise.then(angular.noop, $scope.updateFieldErrors);

            validationKeys = [];

            angular.forEach($scope.collectionLabels, function(bindableWrapper, bindableFieldName) {
              validationKeys.push(bindableFieldName);
            });

            validateCollectionsPromise = ModelValidator.validateFields($scope.formFor, validationKeys, $scope.$validationRules);
            validateCollectionsPromise.then(angular.noop, $scope.updateCollectionErrors);

          } else {
            validateCollectionsPromise = $q.resolve();
            validateFieldsPromise = $q.resolve();
          }

          var deferred = $q.defer();

          $q.waitForAll([validateCollectionsPromise, validateFieldsPromise]).then(
            deferred.resolve,
            function(errors) {

              // If all collections are valid (or no collections exist) this will be an empty array.
              if (angular.isArray(errors[0]) && errors[0].length === 0) {
                errors.splice(0,1);
              }

              deferred.reject(errors);
            });

          return deferred.promise;
        };

        // Expose controller methods to the $scope.controller interface
        $scope.controller = $scope.controller || {};

        angular.copy(controller, $scope.controller);

        // Disable all child inputs if the form becomes disabled.
        $scope.$watch('disable', function(value) {
          angular.forEach($scope.fields, function(field) {
            field.bindableWrapper.disabled = value;
          });

          angular.forEach($scope.buttons, function(wrapper) {
            wrapper.disabled = value;
          });
        });

        // Track field validity and dirty state.
        $scope.formForStateHelper = new $FormForStateHelper($scope);

        // Watch for any validation changes or changes in form-state that require us to notify the user.
        // Rather than using a deep-watch, FormForStateHelper exposes a bindable attribute 'watchable'.
        // This attribute is gauranteed to change whenever validation criteria change (but its value is meaningless).
        $scope.$watch('formForStateHelper.watchable', function() {
          var hasFormBeenSubmitted = $scope.formForStateHelper.hasFormBeenSubmitted();

          // Mark invalid fields
          angular.forEach($scope.fields, function(fieldDatum, bindableFieldName) {
            if (hasFormBeenSubmitted || $scope.formForStateHelper.hasFieldBeenModified(bindableFieldName)) {
              var error = $scope.formForStateHelper.getFieldError(bindableFieldName);

              fieldDatum.bindableWrapper.error = error ? $sce.trustAsHtml(error) : null;
            } else {
              fieldDatum.bindableWrapper.error = null; // Clear out field errors in the event that the form has been reset.
            }
          });

          // Mark invalid collections
          angular.forEach($scope.collectionLabels, function(bindableWrapper, bindableFieldName) {
            var error = $scope.formForStateHelper.getFieldError(bindableFieldName);

            bindableWrapper.error = error ? $sce.trustAsHtml(error) : null;
          });
        });

        /*
         * Update all registered collection labels with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         * @param {Object} fieldNameToErrorMap Map of collection names (or paths) to errors
         */
        $scope.updateCollectionErrors = function(fieldNameToErrorMap) {
          angular.forEach($scope.collectionLabels, function(bindableWrapper, bindableFieldName) {
            var error = NestedObjectHelper.readAttribute(fieldNameToErrorMap, bindableFieldName);

            $scope.formForStateHelper.setFieldError(bindableFieldName, error);
          });
        };

        /*
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         * @param {Object} fieldNameToErrorMap Map of field names (or paths) to errors
         */
        $scope.updateFieldErrors = function(fieldNameToErrorMap) {
          angular.forEach($scope.fields, function(scope, bindableFieldName) {
            var error = NestedObjectHelper.readAttribute(fieldNameToErrorMap, scope.fieldName);

            $scope.formForStateHelper.setFieldError(bindableFieldName, error);
          });
        };
      },
      link: function($scope, $element, $attributes) {
        $element.on('submit', // Override form submit to trigger overall validation.
          function() {
            $scope.formForStateHelper.setFormSubmitted(true);
            $scope.disable = true;

            $scope.controller.validateForm().then(
              function(response) {
                var promise;

                // $scope.submitWith is wrapped with a virtual function so we must check via attributes
                if ($attributes.submitWith) {
                  promise = $scope.submitWith({data: $scope.formFor});
                } else if ($scope.$service && $scope.$service.submit) {
                  promise = $scope.$service.submit($scope.formFor);
                } else {
                  promise = $q.reject('No submit function provided');
                }

                // Issue #18 Guard against submit functions that don't return a promise by warning rather than erroring.
                if (!promise) {
                  promise = $q.reject('Submit function did not return a promise');
                }

                promise.then(
                  function(response) {
                    // $scope.submitComplete is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitComplete) {
                      $scope.submitComplete({data: response});
                    } else {
                      FormForConfiguration.defaultSubmitComplete(response);
                    }
                  },
                  function(errorMessageOrErrorMap) {
                    // If the remote response returned inline-errors update our error map.
                    // This is unecessary if a string was returned.
                    if (angular.isObject(errorMessageOrErrorMap)) {
                      // TODO Questionable: Maybe server should be forced to return fields/collections constraints?
                      $scope.updateCollectionErrors(errorMessageOrErrorMap);
                      $scope.updateFieldErrors(errorMessageOrErrorMap);
                    }

                    // $scope.submitError is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitError) {
                      $scope.submitError({error: errorMessageOrErrorMap});
                    } else {
                      FormForConfiguration.defaultSubmitError(errorMessageOrErrorMap);
                    }
                  });
                promise['finally'](
                  function() {
                    $scope.disable = false;
                  });
              },
              function() {
                $scope.disable = false;

                // $scope.validationFailed is wrapped with a virtual function so we must check via attributes
                if ($attributes.validationFailed) {
                  $scope.validationFailed();
                } else {
                  FormForConfiguration.defaultValidationFailed();
                }
              });

          return false;
        });
      }
    };
  });
