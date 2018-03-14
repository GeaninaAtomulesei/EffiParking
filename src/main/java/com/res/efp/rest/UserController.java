package com.res.efp.rest;

import com.res.efp.domain.model.*;
import com.res.efp.exception.ResourceConflictException;
import com.res.efp.service.NotificationService;
import com.res.efp.service.OwnerService;
import com.res.efp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@RestController
@RequestMapping(value = "/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private NotificationService notificationService;

    @PostConstruct
    public void initAdmin() {
        if (userService.findByUsername("admin") == null) {
            UserRequest admin = new UserRequest();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("geanina.at@gmail.com");
            userService.saveAdmin(admin);
        }
    }

    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public User loadById(@PathVariable("userId") Long userId) {
        return this.userService.findById(userId);
    }

    @RequestMapping(value = "/users/all", method = RequestMethod.GET)
    public List<User> loadAllUsers() {
        return this.userService.findAll();
    }

    @RequestMapping(value = "/users/reset-credentials", method = RequestMethod.GET)
    public ResponseEntity<Map> resetCredentials() {
        this.userService.resetCredentials();
        Map<String, String> result = new HashMap<>();
        result.put("result", "success");
        return ResponseEntity.accepted().body(result);
    }

    @RequestMapping(value = "/users/getByUsername/{username}", method = RequestMethod.GET)
    public ResponseEntity<User> getByUsername(@PathVariable("username") String username) {
        System.out.println("Fetching user with username : " + username);
        User user = userService.findByUsername(username);
        if (user == null) {
            System.out.println("User with username " + username + "was not found.");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public ResponseEntity<?> addUser(@RequestBody UserRequest userRequest, UriComponentsBuilder ucBuilder) {
        User existingUser = this.userService.findByUsername(userRequest.getUsername());
        if (existingUser != null) {
            throw new ResourceConflictException(userRequest.getId(), "Username already exists");
        }
        User user = this.userService.saveUser(userRequest);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/api/user/{userId}").buildAndExpand(user.getId()).toUri());
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/createAdmin", method = RequestMethod.POST)
    public ResponseEntity<?> createAdmin(@RequestBody UserRequest adminRequest, UriComponentsBuilder ucBuilder) {
        User existingUser = this.userService.findByUsername(adminRequest.getUsername());
        if (existingUser != null) {
            throw new ResourceConflictException(adminRequest.getId(), "Username already exists");
        }
        User admin = this.userService.saveAdmin(adminRequest);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/api/user/{userId}").buildAndExpand(admin.getId()).toUri());
        return new ResponseEntity<>(admin, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/whoami")
    public User user() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @RequestMapping(value = "/registerAsOwner", method = RequestMethod.POST)
    public ResponseEntity<?> registerAsOwner(@RequestParam(value = "id") Long id, @RequestBody String organisation) {

        User user = userService.findById(id);
        System.out.println("Creating owner : " + user.getUsername());
        Owner owner = ownerService.findByUsername(user.getUsername());
        if (owner != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Owner with username " + owner.getUsername() + " already exists!");
        }
        ownerService.registerAsOwner(user, organisation);
        return ResponseEntity.ok(id);
    }

    @RequestMapping(value = "/activateOwner", method = RequestMethod.PUT)
    public ResponseEntity<?> activateOwner(@RequestParam(value = "userId") Long id,
                                           @RequestParam(value = "organisation") String organisation) {
        User user = userService.findById(id);
        Owner owner = ownerService.activateOwner(user, organisation);
        return ResponseEntity.ok(owner);
    }

    @RequestMapping(value = "/getNotifications", method = RequestMethod.GET)
    public ResponseEntity<?> getNotifications(@RequestParam(value = "userId") Long userId) {
        if (userService.findById(userId) == null) {
            return ResponseEntity.notFound().build();
        }
        List<Notification> notifications = notificationService.getByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @RequestMapping(value = "/deleteNotification", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteNotification(@RequestParam(value = "notificationId") Long notificationId) {
        Notification notification = notificationService.getById(notificationId);
        if(notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification not found!");
        }
        boolean success = notificationService.deleteNotification(notification);
        if(success) {
            return ResponseEntity.ok(notificationId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @RequestMapping(value = "/users/deleteUser", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@RequestParam(value = "userId") Long userId) {
        if(userService.findById(userId) != null) {
            boolean deleted = userService.deleteUser(userId);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            } else {
                return ResponseEntity.ok(userId);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @RequestMapping(value = "/users/getById", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@RequestParam(value = "userId") Long userId) {
        User user = userService.findById(userId);
        if(user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @RequestMapping(value = "/users/searchByTerm", method = RequestMethod.GET)
    public ResponseEntity<?> searchByTerm(@RequestParam(value = "term") String term) {
        List<User> foundUsers = userService.findByTerm(term);
        return ResponseEntity.ok(foundUsers);
    }

    @RequestMapping(value = "/users/getHistory", method = RequestMethod.GET)
    public ResponseEntity<?> getHistory(@RequestParam(value = "userId") Long userId) {
        if(userService.findById(userId) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        List<HistoryObject> history = userService.getHistory(userId);
        return ResponseEntity.ok(history);
    }
}

