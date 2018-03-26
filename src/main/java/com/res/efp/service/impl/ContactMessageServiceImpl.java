package com.res.efp.service.impl;

import com.res.efp.domain.model.ContactMessage;
import com.res.efp.domain.model.Notification;
import com.res.efp.domain.model.User;
import com.res.efp.domain.repository.ContactMessageRepository;
import com.res.efp.service.ContactMessageService;
import com.res.efp.service.NotificationService;
import com.res.efp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by gatomulesei on 3/22/2018.
 */
@Service
@Transactional
public class ContactMessageServiceImpl implements ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public ContactMessage saveMessage(ContactMessage contactMessage) {
        contactMessage.setDate(LocalDateTime.now());
        Notification notification = new Notification();
        notification.setType(Notification.Type.USER_MESSAGE);
        notification.setDate(LocalDateTime.now());
        notification.setMessage("New contact message from " + contactMessage.getName() + "!");

        ContactMessage message = contactMessageRepository.save(contactMessage);
        notificationService.saveNotification(notification);
        for(User admin : userService.findAllAdmins()) {
            notificationService.pushNotification(notification, admin.getId());
        }
        return message;
    }

    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    @Override
    public ContactMessage getById(Long messageId) {
        return contactMessageRepository.findOne(messageId);
    }

    @Override
    public boolean deleteMessage(Long messageId) {
        try {
            contactMessageRepository.delete(messageId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
