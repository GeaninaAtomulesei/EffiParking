package com.res.efp.service.impl;

import com.res.efp.domain.model.*;
import com.res.efp.domain.repository.NotificationRepository;
import com.res.efp.domain.repository.ReservationRepository;
import com.res.efp.domain.repository.UserRepository;
import com.res.efp.service.AuthorityService;
import com.res.efp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public User findById(Long id) {
        return userRepository.findOne(id);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public List<User> findByTerm(String term) {
        return userRepository.findByTerm(term);
    }

    @Override
    public User saveUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        List<Authority> userAuth = authorityService.findByName("ROLE_USER");
        if (userAuth == null || userAuth.isEmpty() || userAuth.get(0) == null) {
            List<Authority> authorities = new ArrayList<>();
            Authority authority = new Authority();
            authority.setName("ROLE_USER");
            authorityService.saveAuthority(authority);
            authorities.add(authority);
            user.setAuthorities(authorities);
            return this.userRepository.save(user);
        } else {
            user.setAuthorities(userAuth);
            return this.userRepository.save(user);
        }
    }

    @Override
    public User saveAdmin(UserRequest userRequest) {
        User admin = new User();
        admin.setUsername(userRequest.getUsername());
        admin.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        admin.setFirstName(userRequest.getFirstName());
        admin.setLastName(userRequest.getLastName());
        admin.setEmail(userRequest.getEmail());
        List<Authority> adminAuth = authorityService.findByName("ROLE_ADMIN");
        if (adminAuth == null || adminAuth.isEmpty() || adminAuth.get(0) == null) {
            List<Authority> authorities = new ArrayList<>();
            Authority authority = new Authority();
            authority.setName("ROLE_ADMIN");
            authorityService.saveAuthority(authority);
            authorities.add(authority);
            admin.setAuthorities(authorities);
            return this.userRepository.save(admin);
        } else {
            admin.setAuthorities(adminAuth);
            return this.userRepository.save(admin);
        }
    }

    @Override
    public void resetCredentials() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setPassword(passwordEncoder.encode("123"));
            userRepository.save(user);
        }
    }

    @Override
    public List<User> findAllAdmins() {
        List<User> allUsers = userRepository.findAll();
        List<User> admins = new ArrayList<>();
        for (User user : allUsers) {
            for (GrantedAuthority authority : user.getAuthorities()) {
                if (authority.getAuthority().equals("ROLE_ADMIN")) {
                    admins.add(user);
                }
            }
        }
        return admins;
    }

    @Override
    public boolean deleteUser(Long userId) {
        try {
            User user = userRepository.findOne(userId);
            for(Reservation reservation : user.getReservations()) {
                reservation.setUser(null);
                reservation.setParking(null);
                reservation.setLot(null);
                reservationRepository.delete(reservation);
            }
            user.getReservations().clear();
            List<Notification> removedNotifications = new ArrayList<>();
            for(Notification notification : user.getNotifications()) {
                removedNotifications.add(notification);
            }
            user.getNotifications().clear();
            notificationRepository.delete(removedNotifications);
            userRepository.delete(userId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<HistoryObject> getHistory(Long userId) {
        List<HistoryObject> history =  userRepository.findOne(userId).getHistory();
        Collections.reverse(history);
        return history;
    }
}
