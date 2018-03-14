package com.res.efp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@ControllerAdvice
public class ExceptionHandlingController {

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ExceptionResponse> resourceConflict(ResourceConflictException ex) {
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorCode("Conflict");
        response.setErrorMessage(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}
