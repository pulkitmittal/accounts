-- MySQL dump 10.13  Distrib 5.5.14, for Win64 (x86)
--
-- Host: localhost    Database: accounts
-- ------------------------------------------------------
-- Server version	5.5.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_transactions`
--

DROP TABLE IF EXISTS `bank_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_transactions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `BANK_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  `IS_CREDIT` int(1) NOT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_transactions`
--

LOCK TABLES `bank_transactions` WRITE;
/*!40000 ALTER TABLE `bank_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `ACCOUNT_NO` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks`
--

LOCK TABLES `banks` WRITE;
/*!40000 ALTER TABLE `banks` DISABLE KEYS */;
/*!40000 ALTER TABLE `banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealers`
--

DROP TABLE IF EXISTS `dealers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dealers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `ADDRESS` varchar(500) DEFAULT NULL,
  `CITY` varchar(255) NOT NULL,
  `STATE` varchar(45) NOT NULL,
  `TIN` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealers`
--

LOCK TABLES `dealers` WRITE;
/*!40000 ALTER TABLE `dealers` DISABLE KEYS */;
INSERT INTO `dealers` VALUES (1,'Nathuram Agarwal','','Kasganj','Uttar Pradesh',NULL),(2,'Girdhari Lal','A532, Panchkiyuan Crossing','Agra','Uttar Pradesh','1244412111'),(4,'Gopal Krishan',NULL,'Mathura','Uttar Pradesh','1233333333'),(5,'Jawahar',NULL,'Kayamganj','Uttar Pradesh',NULL),(7,'Hari Haran',NULL,'Mainpuri','Uttar Pradesh',NULL);
/*!40000 ALTER TABLE `dealers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealers_payments`
--

DROP TABLE IF EXISTS `dealers_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dealers_payments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DEALER_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  `BANK_TRANSACTION_ID` int(11) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealers_payments`
--

LOCK TABLES `dealers_payments` WRITE;
/*!40000 ALTER TABLE `dealers_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealers_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE` varchar(45) NOT NULL COMMENT 'SHOP, CAR, SCOOTER, ETC',
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  `BANK_TRANSACTION_ID` int(11) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goods` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `DESCRIPTION` varchar(45) DEFAULT NULL,
  `VAT_TAX` decimal(5,2) DEFAULT NULL,
  `ADD_TAX` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'Mono Ropes','Monofilament Ropes',4.00,1.00),(2,'Mono Niwar','Monofilament Niwar',4.00,1.00),(3,'Plastic Tape',NULL,4.00,1.00),(4,'Cotton Niwar',NULL,0.00,0.00),(5,'Cotton Ropes',NULL,0.00,0.00),(6,'PP Ropes','',4.00,1.00),(7,'PP Dori',NULL,4.00,1.00),(8,'RP Dori',NULL,4.00,1.00),(9,'Plastic Sutli',NULL,4.00,1.00),(10,'Plastic Rassi',NULL,4.00,1.00);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loans` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PARTY` varchar(45) NOT NULL,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manufacturers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `ADDRESS` varchar(500) DEFAULT NULL,
  `CITY` varchar(45) NOT NULL,
  `STATE` varchar(45) DEFAULT NULL,
  `TIN` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (1,'Yogeshwar Textiles',NULL,'Bhavnagar','Gujarat',NULL);
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers_payments`
--

DROP TABLE IF EXISTS `manufacturers_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manufacturers_payments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `MANUFACTURER_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  `BANK_TRANSACTION_ID` int(11) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers_payments`
--

LOCK TABLES `manufacturers_payments` WRITE;
/*!40000 ALTER TABLE `manufacturers_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `manufacturers_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchases` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE` varchar(45) NOT NULL COMMENT 'EX-UP PURCHASE, EXEMPTED PURCHASE',
  `MANUFACTURER_ID` int(11) DEFAULT NULL,
  `BILL_NO` varchar(45) DEFAULT NULL,
  `BILL_DATE` date DEFAULT NULL,
  `BILL_AMOUNT` decimal(12,3) DEFAULT NULL,
  `GOODS_TYPE` int(11) DEFAULT NULL,
  `GOODS_QUANTITY` decimal(10,3) DEFAULT NULL,
  `TRANSPORTER_ID` int(11) DEFAULT NULL,
  `FREIGHT_CHARGES` decimal(8,3) DEFAULT NULL,
  `LABOUR_CHARGES` decimal(8,3) DEFAULT NULL,
  `FORM_38` varchar(45) DEFAULT NULL,
  `FORM_C` varchar(45) DEFAULT NULL,
  `RECEIVING_DATE` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE` varchar(45) NOT NULL COMMENT 'Sales Invoice, Tax Invoice',
  `DEALER_ID` int(11) NOT NULL,
  `INVOICE_NO` varchar(45) NOT NULL,
  `INVOICE_DATE` date NOT NULL,
  `ITEM_TYPE` int(11) NOT NULL,
  `ITEM_QUANTITY` decimal(8,3) NOT NULL,
  `ITEM_RATE` decimal(8,3) NOT NULL,
  `VAT_TAX` decimal(8,3) NOT NULL,
  `ADD_TAX` decimal(8,3) NOT NULL,
  `INVOICE_AMOUNT` decimal(12,3) NOT NULL,
  `CREDIT_AMOUNT` decimal(12,3) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'Sales Invoice',1,'123','2014-09-15',2,120.000,40.000,192.000,48.000,5040.000,0.000);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transporters`
--

DROP TABLE IF EXISTS `transporters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transporters` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `ADDRESS` varchar(500) DEFAULT NULL,
  `CITY` varchar(45) NOT NULL,
  `STATE` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transporters`
--

LOCK TABLES `transporters` WRITE;
/*!40000 ALTER TABLE `transporters` DISABLE KEYS */;
INSERT INTO `transporters` VALUES (1,'Jaipur Golden Transport',NULL,'Agra','Uttar Pradesh');
/*!40000 ALTER TABLE `transporters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transporters_payments`
--

DROP TABLE IF EXISTS `transporters_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transporters_payments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TRANSPORTER_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(12,3) NOT NULL,
  `BANK_TRANSACTION_ID` int(11) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transporters_payments`
--

LOCK TABLES `transporters_payments` WRITE;
/*!40000 ALTER TABLE `transporters_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `transporters_payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-09-15  0:57:17
