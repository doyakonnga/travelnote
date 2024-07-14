# Travelnote

## Table
- [Introduction](#introduction)
- [System Architecture](#system-architecture)
- [Database schemas](#database-schemas)
- [Feature](#feature)
   - [User authentication](#user-authentication)
   - [Co-editable journey](#co-editable-journey)
   - [Co-editable consumption record](#co-editable-consumption-record)
   - [Sharing photos](#sharing-photos)
   - [Notification](#notification)
- [Tech stack](#tech-stack)
- [Demo](#demo)
- [Team member](#team-member)

## Introduction
Travelnote is an application facilitating fellow travellers to track their expenses and share their photos in a extremely simplified way.

## System Architecture
- Microservices built on dockerized node.js(express.js or next.js) applications
- Kubernetes cluster deployed on AWS EKS, accepting requests via AWS NLB
- Frontend and backend path-based routing conducted by ingress-nginx controller
- Sharing common code between servers via publishing npm packages
- Inter-server communication through kafka message queues running on redpanda cloud
- Duplicated data and single resposibility of each database to acheive consistency
- User authentication across multiple servers implemented by cookie-based JWT
- Frontend direct interaction with AWS S3 through signed URL generated by Next.js server

![System Architecture](/img/Architecture0001.jpg)

## Database schemas 

![Database Schemas](/img/Architecture0002.jpg)

## Feature

### User authentication
- Signing up/ logging in with a unique email and a valid password
- Signing up/ logging in with Google account via OAuth2.0
- Editing user profile avatar, which defaults Google account avatar if existing

### Co-editable journeys
- Creating a co-editable journey with a customized cover picture uploaded by members
- Searching users with registered emails and adding members into a journey 

### Co-editable consumption records
- Adding consumptions shared by and only accessible to the journey members
- Editing/ deleting a consumption by the owing (paying) member
- Reviewing personal expenses and arrears
- Calculating balances optionally including foreign currencies, which is based on user-configured exchange rate 
- Viewing photos bound to a consumption and redirecting to the album page

### Sharing photos
- Uploading photos accessible only to the journey members
- Optionally binding photos to a specified consumption
- Editing descriptions of/ deleting a photo only by the uploading user
- Creating/deleting albums to classify member-shared photos
- Viewing/ redirecting to the bound consumption of a photo

### Notifications
- Receiving notification of a member's creating/ editing a consumption
- Receiving notification of a member's creating/ editing a photo
- Receiving notification of a member's creating a album or classifying some photos

## Tech stack

**Client:** React.js/ Next.js/ Typescript

**Server:** Node.js/ Express.js/ Typescript/ Prisma

**Event Broker:** Kafkajs/ Redpanda cloud

**Containerization:** Docker-desktop/ Kubernetes/ Skaffold

**Cloud(AWS):** Route 53/ EKS/ RDS-postgresql/ S3

**Test:** Jest/ Supertest/ Docker-compose

## Demo


## Team member

**Full-stack:** [Chang](https://github.com/doyakonnga)