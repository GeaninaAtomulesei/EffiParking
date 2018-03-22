package com.res.efp.service;

import com.res.efp.domain.model.ContactMessage;

import java.util.List;

/**
 * Created by gatomulesei on 3/22/2018.
 */
public interface ContactMessageService {
    ContactMessage saveMessage(ContactMessage contactMessage);
    List<ContactMessage> getAllMessages();
    ContactMessage getById(Long messageId);
    boolean deleteMessage(Long messageId);
}
