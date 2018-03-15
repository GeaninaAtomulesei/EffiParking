package com.res.efp.domain.repository;

import com.res.efp.domain.model.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {

    Parking findByName(String name);
    List<Parking> findByCity(String cityName);
    List<Parking> findByStreet(String streetName);
    List<Parking> findByStreetAndNumber(String streetName, String number);

    List<Parking> findByOwnerUsername(String owner);

    @Query(value = "select distinct p from Parking as p where " +
            "p.name like %:term% or " +
            "p.locationName like %:term% or " +
            "p.street like %:term% or " +
            "p.city like %:term% or " +
            "concat(p.name, ' ', p.locationName) like %:term% or " +
            "concat(p.name, ' ', p.street) like %:term% or " +
            "concat(p.street, ' ', p.number) like %:term% or " +
            "concat(p.street, ' ', p.number, ' ', p.city) like %:term% or " +
            "concat(p.locationName, ' ', p.city) like %:term% ")
    List<Parking> findByTerm(@Param("term") String term);

    @Query(value = "select distinct p from Parking as p where " +
            "(p.name like %:term% or " +
            "p.locationName like %:term% or " +
            "p.street like %:term% or " +
            "p.city like %:term% or " +
            "concat(p.name, ' ', p.locationName) like %:term% or " +
            "concat(p.name, ' ', p.street) like %:term% or " +
            "concat(p.street, ' ', p.number) like %:term% or " +
            "concat(p.street, ' ', p.number, ' ', p.city) like %:term% or " +
            "concat(p.locationName, ' ', p.city) like %:term%) " +
            "and p.owner.id = :ownerId")
    List<Parking> findByTermAndOwner(@Param("term") String term, @Param("ownerId") Long ownerId);

}
