package com.res.efp.service.impl;

import com.res.efp.domain.model.User;
import com.res.efp.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by gatomulesei on 3/16/2018.
 */
@Service
@Transactional
public class StorageService {

    @Autowired
    private UserRepository userRepository;

    private final Path rootLocation = Paths.get("upload-dir");

    public void init() {
        try {
            if(!Files.exists(rootLocation)) {
                Files.createDirectory(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage.");
        }
    }

    public void store(MultipartFile file, Long userId) {
        User user = userRepository.findOne(userId);
        try {
            if(!Files.exists(Paths.get(rootLocation + "/" + file.getOriginalFilename()))) {
                Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
            }
            user.setPhoto(file.getOriginalFilename());
            userRepository.save(user);
        } catch(Exception e) {
            throw new RuntimeException("Photo storage failure.");
        }
    }

    public Resource loadFile(String fileName) {
        try {
            Path file = rootLocation.resolve(fileName);
            return new UrlResource(file.toUri());
        } catch(MalformedURLException e) {
            throw new RuntimeException("Photo load failure.");
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }
}
