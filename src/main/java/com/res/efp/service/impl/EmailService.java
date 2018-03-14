package com.res.efp.service.impl;

import com.res.efp.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail (User user) {
        mailSender.send(getPreparator(user));
    }

    private MimeMessagePreparator getPreparator(User user) {
        return mimeMessage -> {
                mimeMessage.setFrom(new InternetAddress("effiparking@gmail.com"));
                mimeMessage.setRecipients(Message.RecipientType.TO, user.getEmail());
                mimeMessage.setText("You have been successfully registered as an owner in EffiParking! " + "\n" +
                        "Click the following link to access the application and log in : " + "\n" +
                        "http://localhost:4200/");
                mimeMessage.setSubject("EffiParking : Owner Activation Success");
        };
    }
}
