package com.res.efp.domain.repository;

import com.res.efp.domain.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by gatomulesei on 2/5/2018.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByUsername(String username);
    List<Employee> findByOwnerId(Long ownerId);

    @Query(value = "select distinct e from Employee as e where " +
                    "(e.firstName like %:term% " +
                    "or e.lastName like %:term% " +
                    "or e.username like %:term% " +
                    "or concat(e.firstName, ' ', e.lastName) like %:term%)" +
                    "and e.owner.id = :ownerId")
    List<Employee> findByTermAndOwnerId(@Param("ownerId") Long ownerId, @Param("term") String term);
}
