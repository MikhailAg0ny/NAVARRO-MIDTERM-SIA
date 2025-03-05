package com.navarro.google_integration.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.services.people.v1.PeopleService;
import com.google.api.services.people.v1.model.ListConnectionsResponse;
import com.google.api.services.people.v1.model.Person;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class GoogleContactsService {

    private static final String APPLICATION_NAME = "Google Contacts Integration";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    private PeopleService getPeopleService(OAuth2AccessToken accessToken) throws GeneralSecurityException, IOException {
        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken.getTokenValue(), Date.from(accessToken.getExpiresAt())));
        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);
        return new PeopleService.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                requestInitializer
        )
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public List<Person> getContacts(OAuth2AuthenticationToken authentication) throws IOException, GeneralSecurityException {
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName()
        );
        PeopleService peopleService = getPeopleService(client.getAccessToken());
        ListConnectionsResponse response = peopleService.people().connections()
                .list("people/me")
                .setPersonFields("names,emailAddresses")
                .execute();

        // Handle case where connections is null
        return response.getConnections() != null ? response.getConnections() : new ArrayList<>();
    }

    public Person addContact(Person person, OAuth2AuthenticationToken authentication) throws IOException, GeneralSecurityException {
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName()
        );
        PeopleService peopleService = getPeopleService(client.getAccessToken());

        // Create the contact and return it
        Person createdContact = peopleService.people().createContact(person).execute();
        return createdContact;
    }

    public Person updateContact(String resourceName, Person updatedPerson, OAuth2AuthenticationToken authentication) throws IOException, GeneralSecurityException {
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName()
        );
        PeopleService peopleService = getPeopleService(client.getAccessToken());

        // Get the existing contact to retrieve necessary metadata
        Person existingContact = peopleService.people().get(resourceName)
                .setPersonFields("names,emailAddresses,metadata")
                .execute();

        // Set the etag for the update operation
        updatedPerson.setEtag(existingContact.getEtag());

        // Perform the update with explicit updatePersonFields
        return peopleService.people().updateContact(resourceName, updatedPerson)
                .setUpdatePersonFields("names,emailAddresses")
                .execute();
    }

    public void deleteContact(String resourceName, OAuth2AuthenticationToken authentication) throws IOException, GeneralSecurityException {
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName()
        );
        PeopleService peopleService = getPeopleService(client.getAccessToken());
        peopleService.people().deleteContact(resourceName).execute();
    }
}