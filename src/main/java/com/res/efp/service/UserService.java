package com.res.efp.service;

import com.res.efp.domain.model.HistoryObject;
import com.res.efp.domain.model.User;
import com.res.efp.domain.model.UserRequest;

import java.util.List;

/**
 * Created by gatomulesei on 2/1/2018.
 */
public interface UserService {
    User findById(Long id);
    User findByUsername(String username);
    List<User> findAll();
    List<User> findByTerm(String term);
    User saveUser(UserRequest userRequest);
    User saveAdmin(UserRequest userRequest);
    void resetCredentials();
    List<User> findAllAdmins();
    boolean deleteUser(Long userId);
    List<HistoryObject> getHistory(Long userId);
    User updateUser(UserRequest userRequest, Long userId);
}
