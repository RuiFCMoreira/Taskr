package pt.mei.ea.taskr.services;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final String bucketName;
    private final Storage storage;

    public StorageService(Storage storage, Environment env) {
        this.storage = storage;
        this.bucketName = env.getProperty("bucket-name");
    }

    public byte[] downloadFile(String fileName){
        log.info("Bucket name is " + bucketName);
        Bucket bucket = storage.get(bucketName);
        if(bucket == null || fileName == null) return new byte[]{};
        Blob blob = bucket.get(fileName);
        if(blob == null){
            return new byte[]{};
        }
        return blob.getContent();
    }

    public boolean uploadFile(String fileName, byte[] bytes){
        Bucket bucket = storage.get(bucketName);
        return bucket.create(fileName, bytes) != null;
    }

    public boolean deleteFile(String fileName){
        Blob blob = storage.get(bucketName, fileName);
        if(blob == null){
            return true;
        }
        return blob.delete();
    }

    public boolean updateBucket(String fileName, byte[] bytes){
        if(!deleteFile(fileName)){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file");
        }
        return uploadFile(fileName, bytes);
    }
}
