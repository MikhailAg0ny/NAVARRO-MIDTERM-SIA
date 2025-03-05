package com.navarro.google_integration.controller;

import com.google.api.services.people.v1.model.EmailAddress;
import com.google.api.services.people.v1.model.Name;
import com.google.api.services.people.v1.model.Person;
import com.navarro.google_integration.service.GoogleContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/contacts")
public class ContactsController {

    @Autowired
    private GoogleContactsService googleContactsService;

    @GetMapping
    public String getContacts(Model model, OAuth2AuthenticationToken authentication,
                              @AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            // Get the Google user information
            Map<String, Object> attributes = oauth2User.getAttributes();
            String name = (String) attributes.get("name");
            String email = (String) attributes.get("email");
            String picture = (String) attributes.get("picture");

            // Add user information to the model
            model.addAttribute("userName", name);
            model.addAttribute("userEmail", email);
            model.addAttribute("userPicture", picture);

            // Get contacts
            List<Person> contacts = googleContactsService.getContacts(authentication);
            model.addAttribute("contacts", contacts);

            return "contacts";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Error retrieving contacts: " + e.getMessage());
            return "error";
        }
    }

    @PostMapping
    public String addContact(@RequestParam String name, @RequestParam String email,
                             OAuth2AuthenticationToken authentication, RedirectAttributes redirectAttributes) {
        try {
            // Create a new Person object
            Person person = new Person();

            // Set name
            Name contactName = new Name();
            contactName.setDisplayName(name);
            contactName.setGivenName(name); // Also set given name which may be used by Google API
            person.setNames(Collections.singletonList(contactName));

            // Set email
            EmailAddress contactEmail = new EmailAddress();
            contactEmail.setValue(email);
            person.setEmailAddresses(Collections.singletonList(contactEmail));

            // Add the contact
            Person addedPerson = googleContactsService.addContact(person, authentication);

            redirectAttributes.addFlashAttribute("success", "Contact added successfully: " + name);
            return "redirect:/contacts";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error adding contact: " + e.getMessage());
            return "redirect:/contacts";
        }
    }

    @PostMapping("/update")
    public String updateContact(@RequestParam String resourceName, @RequestParam String name,
                                @RequestParam String email, OAuth2AuthenticationToken authentication,
                                RedirectAttributes redirectAttributes) {
        try {
            // Create a new Person object for the update
            Person person = new Person();

            // Set name
            Name contactName = new Name();
            contactName.setDisplayName(name);
            contactName.setGivenName(name); // Also set given name which may be used by Google API
            person.setNames(Collections.singletonList(contactName));

            // Set email
            EmailAddress contactEmail = new EmailAddress();
            contactEmail.setValue(email);
            person.setEmailAddresses(Collections.singletonList(contactEmail));

            // Update the contact
            googleContactsService.updateContact(resourceName, person, authentication);

            redirectAttributes.addFlashAttribute("success", "Contact updated successfully: " + name);
            return "redirect:/contacts";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error updating contact: " + e.getMessage());
            return "redirect:/contacts";
        }
    }

    @PostMapping("/delete")
    public String deleteContact(@RequestParam String resourceName, OAuth2AuthenticationToken authentication,
                                RedirectAttributes redirectAttributes) {
        try {
            googleContactsService.deleteContact(resourceName, authentication);
            redirectAttributes.addFlashAttribute("success", "Contact deleted successfully");
            return "redirect:/contacts";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error deleting contact: " + e.getMessage());
            return "redirect:/contacts";
        }
    }
}