package com.res.efp.service;

import com.res.efp.domain.model.Authority;

import java.util.List;

/**
 * Created by gatomulesei on 2/1/2018.
 */
public interface AuthorityService {
    List<Authority> findById(Long id);
    List<Authority> findByName(String authorityName);
    Authority saveAuthority(Authority authority);
}
