-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: miniproject
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoptions`
--

DROP TABLE IF EXISTS `adoptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pet_id` int NOT NULL,
  `pet_name` varchar(100) DEFAULT NULL,
  `pet_breed` varchar(100) DEFAULT NULL,
  `pet_age` int DEFAULT NULL,
  `pet_type` varchar(50) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text,
  `reason` text,
  `pet_stay` text,
  `caretaker_name` varchar(100) DEFAULT NULL,
  `caretaker_contact` varchar(20) DEFAULT NULL,
  `home_condition` varchar(50) DEFAULT NULL,
  `people_count` int DEFAULT NULL,
  `document_url` varchar(255) DEFAULT NULL,
  `interview_method` varchar(20) DEFAULT NULL,
  `interview_contact` varchar(100) DEFAULT NULL,
  `agreed_interview` tinyint(1) DEFAULT '0',
  `admin_note` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `application_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `adoptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `adoptions_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoptions`
--

LOCK TABLES `adoptions` WRITE;
/*!40000 ALTER TABLE `adoptions` DISABLE KEYS */;
INSERT INTO `adoptions` VALUES (1,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',3,'Teddy','Golden Retriever',4,'Dog','9075833250','home','companion','relatives','tejaswini','1234567889','Apartment',2,'uploads/documents/1776759459125-6960355.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'approved','2026-04-21 08:17:39'),(2,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',2,'Zuzu','Siamese',3,'Cat','9075833250','home','hjbhj','kjnj','tejaswini','1234567889','Apartment',2,'uploads/documents/1776764063566-833062382.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'approved','2026-04-21 09:34:23'),(3,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',1,'Oreo','Domestic Shorthair',2,'Cat','9075833250','home','companion','relatives','tejaswini','1234567889','House with garden',2,'uploads/documents/1776834051188-645328772.jpg','Video Call','pattarbhoomi@gmail.com',1,'approved!','approved','2026-04-22 05:00:51'),(4,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',1,'Oreo','Domestic Shorthair',2,'Cat','9075833250','home','ojjnj','jmiji','tejaswini','1234567889','House with garden',2,'uploads/documents/1776834175308-758230474.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'approved','2026-04-22 05:02:55'),(5,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',2,'Zuzu','Siamese',3,'Cat','9075833250','dfdv','feresdfrrseg','efer','ferf','ferf','House with garden',0,'uploads/documents/1776834608312-68134363.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'rejected','2026-04-22 05:10:08'),(6,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',1,'Oreo','Domestic Shorthair',2,'Cat','9075833250','home','companion','relatives','tejaswini','1234567889','House with garden',2,'uploads/documents/1776950797074-737292830.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'approved','2026-04-23 13:26:37'),(7,13,'Ruchi','ruchi@gmail.com',1,'Oreo','Domestic Shorthair',2,'Cat','5678905454','home','i want a companion','relatives','tejaswini','1234567889','House with garden',1,'uploads/documents/1777133801241-164232917.png','Video Call','ruchi@gmail.com',1,'Congratulations,Ruchi!','approved','2026-04-25 16:16:41'),(8,10,'Bhoomi Pattar','pattarbhoomi@gmail.com',1,'Oreo','Domestic Shorthair',2,'Cat','9075833250','pimple gurav','companion','relatives','tejaswini','1234567890','House with garden',1,'uploads/documents/1777196273799-691374802.jpg','Video Call','pattarbhoomi@gmail.com',1,NULL,'pending','2026-04-26 09:37:53');
/*!40000 ALTER TABLE `adoptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_reports`
--

DROP TABLE IF EXISTS `animal_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `animal_type` varchar(50) DEFAULT NULL,
  `description` text,
  `location` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','acknowledged','resolved') DEFAULT 'pending',
  `ngo_message` text,
  `admin_note` text,
  `ngo_id` int DEFAULT NULL,
  `reported_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_reports`
--

LOCK TABLES `animal_reports` WRITE;
/*!40000 ALTER TABLE `animal_reports` DISABLE KEYS */;
INSERT INTO `animal_reports` VALUES (1,10,'Bhoomi Pattar','pattarbhoomi@gmail.com','9075833250','Dog','stray','akurdi','uploads/reports/1777008507553-683103349.jpg','resolved','We have received your report and will look into it shortly. Thank you for caring! ?',NULL,1,'2026-04-24 05:28:27','2026-04-24 05:28:52'),(2,10,'Bhoomi Pattar','pattarbhoomi@gmail.com','9075833250','Dog','injured','akurdi','uploads/reports/1777055621966-818613180.jpg','resolved','we have received your report and are on our way to help',NULL,1,'2026-04-24 18:33:42','2026-04-24 18:36:22'),(3,13,'Ruchi','ruchi@gmail.com','5678905454','Dog','injured','akurdi','uploads/reports/1777134009939-728464494.jpg','resolved','We have received your report and will look into it shortly. Thank you for caring! ?',NULL,1,'2026-04-25 16:20:09','2026-04-25 16:21:10');
/*!40000 ALTER TABLE `animal_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificateId` varchar(255) NOT NULL,
  `issueDate` datetime NOT NULL,
  `petName` varchar(255) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `adoptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificateId` (`certificateId`),
  KEY `adoptionId` (`adoptionId`),
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`adoptionId`) REFERENCES `adoptions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `rating` int DEFAULT NULL,
  `image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `likes` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (11,'Ruchi','ruchi@gmail.com','Adopted a companion-Cookie!',5,NULL,'2026-04-26 13:53:20','2026-04-26 13:53:20',13,0);
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ngo_pets`
--

DROP TABLE IF EXISTS `ngo_pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ngo_pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ngo_id` int NOT NULL,
  `ngo_name` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `temperament` varchar(100) DEFAULT NULL,
  `description` text,
  `vaccinated_rabies` tinyint(1) DEFAULT '0',
  `vaccinated_distemper` tinyint(1) DEFAULT '0',
  `vaccinated_parvovirus` tinyint(1) DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `report_id` int DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_note` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ngo_pets`
--

LOCK TABLES `ngo_pets` WRITE;
/*!40000 ALTER TABLE `ngo_pets` DISABLE KEYS */;
INSERT INTO `ngo_pets` VALUES (1,1,'Tejaswini Shelter','cookie','dog','hjhj',2,'friendly','stray',1,0,1,'images/1777008594222-961686237.jpg',NULL,'approved',NULL,'2026-04-24 05:29:54'),(2,1,'Tejaswini Shelter','cookie','dog','hjhj',2,'friendly','hcgdhycg',1,1,0,'images/1777055885818-224065802.jpg',1,'approved',NULL,'2026-04-24 18:38:05'),(3,1,'Tejaswini Shelter','cookie','dog','hjhj',2,'friendly','kdhdassdhgj',1,1,0,'images/1777134152698-519619713.jpg',NULL,'approved','added','2026-04-25 16:22:32');
/*!40000 ALTER TABLE `ngo_pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ngos`
--

DROP TABLE IF EXISTS `ngos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ngos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ngos`
--

LOCK TABLES `ngos` WRITE;
/*!40000 ALTER TABLE `ngos` DISABLE KEYS */;
INSERT INTO `ngos` VALUES (2,'Saahas For Animals','support@saahasforpune.org','$2b$10$8OmwkrqgA/0/vofRuz50g.FE9ePZn4ZLutNnYxeKH1uQevSParAMe','98201 22602','Saahas for animals hospital, behind Nyankosh Bunglow, Jay Mallhar Colony, Walhekarwadi, Gaon, Nigdi, Pimpri-Chinchwad, Maharashtra 411033','2026-04-26 14:11:58');
/*!40000 ALTER TABLE `ngos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `temperament` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `description` text,
  `vaccinated_rabies` tinyint(1) DEFAULT '0',
  `vaccinated_distemper` tinyint(1) DEFAULT '0',
  `vaccinated_parvovirus` tinyint(1) DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','adopted','pending') DEFAULT 'available',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (1,'Oreo','Domestic Shorthair','Cat','Playful & Energetic',2,'Oreo was rescued from a crowded market where he was scared and underweight. After gentle care and doctor checkups, he is now healthy and ready to become part of a loving home.',1,1,1,'images/oreo.jpeg','adopted','2026-04-19 07:36:53'),(2,'Zuzu','Siamese','Cat','Cuddly & Affectionate',3,'Zuzu was found alone in a garden, hiding under leaves and shivering. With warm shelter and patience, Zuzu has blossomed into a loving and affectionate companion.',1,1,1,'images/zuzu.jpeg','adopted','2026-04-19 07:36:53'),(3,'Teddy','Golden Retriever','Dog','Loyal & Brave',4,'Teddy was found wandering near a busy park, limping and anxious. After a vet visit and lots of love, he is ready to share his loyal, brave spirit with a new family.',1,1,1,'images/teddy.jpeg','adopted','2026-04-19 07:36:53'),(4,'Muffin','Rabbit','Rabbit','Gentle & Sweet',1,'Muffin was rescued from a rainy alley, cold and hungry. Thanks to warm care and kindness, Muffin is now sweet, gentle, and ready for a calm forever home.',0,0,0,'images/muffin.jpeg','available','2026-04-19 07:36:53'),(5,'Bholi','Persian Cat','Cat','Shy & Sweet',2,'Bholi was surrendered when her family could no longer care for her. She is shy, sweet, and ready to bloom in a gentle home that gives her time to trust.',1,1,1,'images/bholi.jpeg','available','2026-04-19 07:36:53'),(6,'Browny','Golden Retriever','Dog','Friendly & Playful',3,'Browny was picked up near a busy street, looking for food and comfort. After resting and getting healthy again, he is now friendly and playful, ready for a warm family.',1,1,1,'images/browny.jpeg','available','2026-04-19 07:36:53'),(7,'Dora','Beagle','Dog','Explorer & Fun',1,'Dora arrived from a crowded shelter where she waited too long. Her curious, adventurous spirit has only grown stronger, and she is eager to explore a new loving home.',1,1,1,'images/dora.jpeg','available','2026-04-19 07:36:53'),(8,'Luna & Leo','Siamese Cats','Cat','A Bonded Pair',2,'This bonded pair were rescued together from an apartment complex where they were stressed and scared. They must stay together and are happiest in a home that welcomes both of them.',1,1,1,'images/luna&leo.jpeg','available','2026-04-19 07:36:53'),(9,'Max','German Shepherd','Dog','Goofy & Lovable',4,'Max was found alone near a construction area and looked tired from roaming. Now healthy and happy, he is ready to bring his fun-loving energy to a loyal family.',1,1,1,'images/max.jpeg','available','2026-04-19 07:36:53'),(10,'Mitthu','Parrot','Bird','Talkative & Chirpy',5,'Mitthu arrived from a crowded home and was eager for attention. This chatty parrot is healthy, social, and ready for someone who can give him a loving, attentive home.',0,0,0,'images/mitthu.jpeg','available','2026-04-19 07:36:53'),(11,'Snowflake','Persian Cat','Cat','Graceful & Calm',3,'Snowflake was rescued from a chilly rooftop, thin and timid from living outside. After care and warmth, she has become graceful and calm, ready for a loving home.',1,1,1,'images/snowflake.jpeg','available','2026-04-19 07:36:53'),(18,'cookie','hjhj','dog','friendly',2,'kdhdassdhgj',1,1,0,'images/1777134152698-519619713.jpg','available','2026-04-25 16:23:38');
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'Minnie','minniej@gmail.com','$2b$10$cPLlju7ZnuCjfh6Owa8dV.Fvrk0edQK3pnNtWeJ2F9mrFZIocGt4m','2026-04-18 18:22:54','5678905454','user'),(10,'Bhoomi Pattar','pattarbhoomi@gmail.com','$2b$10$thcCKi5vyGt6D8AT4IfqoOUqcSxjzoagYeXV5X2GK85fOTSh37O3m','2026-04-19 06:36:31','9075833250','user'),(12,'Niraj Jambure','novaits641@gmail.com','$2b$10$AIFRUIXy52wa0OmuQs3a7OfgDa9x9/EHgRTyZdRZfX/BuPFcvBSGO','2026-04-25 08:49:12','5678905454','user'),(13,'Ruchi','ruchi@gmail.com','$2b$10$SftGFklEAo9.p5lCiPOkQuLdHBrTua5ecuq0mqFmAMWHWyhykXxqG','2026-04-25 16:14:52','5678905454','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 21:52:55
