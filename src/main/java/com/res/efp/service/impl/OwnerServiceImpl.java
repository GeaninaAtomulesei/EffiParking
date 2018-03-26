package com.res.efp.service.impl;

import com.res.efp.domain.model.*;
import com.res.efp.domain.repository.OwnerRepository;
import com.res.efp.domain.repository.UserRepository;
import com.res.efp.service.AuthorityService;
import com.res.efp.service.NotificationService;
import com.res.efp.service.OwnerService;
import com.res.efp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Service
@Transactional
public class OwnerServiceImpl implements OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Owner findById(Long id) {
        return ownerRepository.findOne(id);
    }

    @Override
    public Owner findByUsername(String username) {
        return ownerRepository.findByUsername(username);
    }

    @Override
    public Owner saveOwner(Owner owner) {
        Authority authority = new Authority();
        authority.setName("ROLE_OWNER");
        authorityService.saveAuthority(authority);
        List<Authority> authorities = new ArrayList<>();
        authorities.add(authority);
        owner.setAuthorities(authorities);
        return ownerRepository.save(owner);
    }

    @Override
    public User registerAsOwner(User user, String organisation) {
        List<User> admins = userService.findAllAdmins();
        Notification notification = new Notification();
        notification.setType(Notification.Type.OWNER_REQUEST);
        notification.setDate(LocalDateTime.now());
        notification.setMessage(organisation);

        UserRequest request = new UserRequest();
        request.setId(user.getId());
        request.setFirstName(user.getFirstName());
        request.setLastName(user.getLastName());
        request.setEmail(user.getEmail());
        request.setUsername(user.getUsername());
        notification.setUserRequest(request);

        notificationService.saveNotification(notification);
        for(User admin : admins) {
            notificationService.pushNotification(notification, admin.getId());
        }
        return user;
    }

    @Override
    public Owner activateOwner(User user, String organisation) {
        Owner owner = new Owner();
        owner.setUsername(user.getUsername());
        owner.setFirstName(user.getFirstName());
        owner.setLastName(user.getLastName());
        owner.setEmail(user.getEmail());
        owner.setPassword(user.getPassword());
        owner.setOrganisation(organisation);
        owner.setReservations(user.getReservations());
        if(authorityService.findByName("ROLE_OWNER") == null || authorityService.findByName("ROLE_OWNER").get(0) == null) {
            Authority authority = new Authority();
            authority.setName("ROLE_OWNER");
            authorityService.saveAuthority(authority);
            List<Authority> authorities = new ArrayList<>();
            authorities.add(authority);
            owner.setAuthorities(authorities);
        } else {
            List<Authority> authorities = authorityService.findByName("ROLE_OWNER");
            owner.setAuthorities(authorities);
        }
        userService.deleteUser(user.getId());
        Owner newOwner = ownerRepository.save(owner);
        if(newOwner != null) {
            emailService.sendEmail(owner);
        }
        return newOwner;
    }

    @Override
    public void deleteOwner(Long id) {
        ownerRepository.delete(id);
    }

    @Override
    public List<Owner> findAllOwners() {
        return ownerRepository.findAll();
    }

    @Override
    public boolean isOwnerExists(Owner owner) {
        return (ownerRepository.findByUsername(owner.getUsername()) != null);
    }

    @Override
    public User revertToUser(Long ownerId) {
        Owner owner = ownerRepository.findOne(ownerId);
        UserRequest userRequest = new UserRequest();
        userRequest.setFirstName(owner.getFirstName());
        userRequest.setLastName(owner.getLastName());
        userRequest.setUsername(owner.getUsername());
        userRequest.setPassword(owner.getPassword());
        userRequest.setEmail(owner.getEmail());
        return userService.saveUser(userRequest);
    }
}
