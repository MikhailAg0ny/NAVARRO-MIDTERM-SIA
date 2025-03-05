package com.navarro.google_integration.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.people.v1.PeopleService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Configuration
public class GoogleConfig {

    private static final String APPLICATION_NAME = "Google Contacts Integration";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    @Bean
    public PeopleService peopleService() throws GeneralSecurityException, IOException {
        return new PeopleService.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                null // Set your credentials here
        )
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
}