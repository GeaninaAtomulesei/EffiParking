package com.res.efp.service.impl;

import com.res.efp.domain.model.Notification;
import com.res.efp.domain.model.User;
import com.res.efp.domain.repository.NotificationRepository;
import com.res.efp.domain.repository.UserRepository;
import com.res.efp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Created by gatomulesei on 3/9/2018.
 */
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public void pushNotification(Notification notification, Long userId) {
        User user = userRepository.findOne(userId);
        user.getNotifications().add(notification);
        notification.getUsers().add(user);
        userRepository.save(user);
    }

    @Override
    public List<Notification> getByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findAll();
        List<Notification> userNotifications = new ArrayList<>();
        for (Notification notification : notifications) {
            for (User user : notification.getUsers()) {
                if (Objects.equals(user.getId(), userId)) {
                    userNotifications.add(notification);
                }
            }
        }
        Collections.reverse(userNotifications);
        return userNotifications;
    }

    @Override
    public boolean deleteNotification(Notification notification) {
        try {
            for (User user : notification.getUsers()) {
                user.getNotifications().remove(notification);
            }
            notification.getUsers().clear();
            notificationRepository.delete(notification);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Notification getById(Long notificationId) {
        return notificationRepository.findOne(notificationId);
    }
}
