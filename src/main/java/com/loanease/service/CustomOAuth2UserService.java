package com.loanease.service;

import com.loanease.model.User;
import com.loanease.repository.UserRepository;
import com.loanease.security.CustomOAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    @Autowired
    private UserRepository userRepository;

    private final OidcUserService delegate = new OidcUserService();

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) {
        // Use Spring’s default OIDC loader
        OidcUser oidcUser = delegate.loadUser(userRequest);

        // Your custom logic: find or create the user in DB
        String email = oidcUser.getEmail();
       // System.out.println("EMAIL (from Google): " + email);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(oidcUser.getFullName());
            newUser.setProvider(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
            newUser.setRole("USER");
         //   System.out.println("DEBUG: Creating new user: " + newUser.getEmail());
            // 🎯 Assign ADMIN role to specific emails
            if (email.equalsIgnoreCase("Kiranannamareddy99@gmail.com")) {
                newUser.setRole("ADMIN");
            } else {
                newUser.setRole("USER");
            }
            return newUser;
        });
        // Update any necessary user details
        user.setName(oidcUser.getFullName());
        user.setProviderId(oidcUser.getName());

        // 🎯 Make sure to update role for existing users too
        if (email.equalsIgnoreCase("Kiranannamareddy99@gmail.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }
        user = userRepository.save(user);
        userRepository.flush();
    //    System.out.println("DEBUG: Saved user with ID: " + user.getId());

        return new CustomOAuth2User(oidcUser, user);
    }
}
