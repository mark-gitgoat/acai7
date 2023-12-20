import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

val confluentVersion = "7.3.1"
val kafkaVersion = "3.3.2"

plugins {
    val kotlinVersion = "1.8.10"
    application
    kotlin("jvm") version kotlinVersion
}

group = "com.sunbit"
version = "$confluentVersion-SNAPSHOT"
description = "kafka-connect"

repositories {
    mavenCentral()
    maven { url = uri("https://packages.confluent.io/maven/") }
}

application {
    mainClass.set("unused")
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}

dependencies {
    implementation("org.apache.kafka", "connect-api", kafkaVersion)
    runtimeOnly("io.confluent", "kafka-connect-avro-converter", confluentVersion)
    runtimeOnly("io.confluent", "kafka-schema-registry-client", confluentVersion)
    runtimeOnly("com.github.jcustenborder.kafka.connect", "kafka-connect-transform-archive", "0.1.0.3")
}
