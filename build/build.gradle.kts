import io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension
import org.apache.avro.compiler.specific.SpecificCompiler.FieldVisibility
import org.gradle.plugins.ide.idea.model.IdeaModel

plugins {
    val kotlinVersion = "1.3.61"
    id("org.jetbrains.kotlin.jvm") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.allopen") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.noarg") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.jpa") version kotlinVersion
    id("org.springframework.boot") version "2.3.0.RELEASE"
    id("io.spring.dependency-management") version "1.0.8.RELEASE"
    id("org.flywaydb.flyway") version "5.1.1"
    id("java")
    id("idea")
    id("groovy")
    id("com.github.davidmc24.gradle.plugin.avro") version "1.2.0"
    id("com.adarshr.test-logger") version "1.7.0"
    application
    jacoco
}

application {
    mainClassName = "com.sunbit.accountservice.Application"
}

val ddTraceVersion = "1.6.0"

repositories {
    mavenCentral()
    jcenter()
    maven { url = uri("https://dl.bintray.com/gradle/gradle-plugins") }
    maven { url = uri("https://jitpack.io") } // for spring-test-junit5
    maven { url = uri("https://packages.confluent.io/maven/") }
    maven {
        url = uri("https://maven.pkg.github.com/sunbit-dev/sunbit-common")
        credentials {
            username = System.getenv("GITHUB_PACKAGE_USERNAME") ?: githubPackages().first
            password = System.getenv("GITHUB_PACKAGE_TOKEN") ?: githubPackages().second
        }
    }
}
   implementation("commons-beanutils:commons-beanutils@1.9.2")
    implementation("org.eclipse.jetty:jetty-http@9.4.28.v20200408")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-cbor@2.11.0")
    implementation("pypi:pip@9.0.3")
    implementation("pypi:setuptools@39.2.0")
    implementation("org.springframework:spring-beans@5.2.6.RELEASE")
    implementation("org.springframework.boot:spring-boot-starter-web@2.3.0.RELEASE")
    implementation("org.springframework:spring-core@5.2.6.RELEASE")
