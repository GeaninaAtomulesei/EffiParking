package com.res.efp.service;

import com.res.efp.domain.model.Owner;
import com.res.efp.domain.model.User;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
public interface OwnerService {
    Owner findById(Long id);
    Owner findByUsername(String username);
    Owner saveOwner(Owner owner);
    User registerAsOwner(User user, String organisation);
    Owner activateOwner(User user, String organisation);
    void deleteOwner(Long id);
    List<Owner> findAllOwners();
    boolean isOwnerExists(Owner owner);
    User revertToUser(Long ownerId);

}
