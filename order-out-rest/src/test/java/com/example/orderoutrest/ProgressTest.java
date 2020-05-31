package com.example.orderoutrest;

import com.example.objects.ProgressEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class ProgressTest {
    @Test
    void progress() {
        ProgressController controller = new ProgressController();
        ProgressEntity progress = controller.getProgress("user1");
        assert progress.getBudget() == 100;
        assert progress.getPercentOrder() == 50;
        assert progress.getCookCount() == 1;
        assert progress.getOrderCount() == 1;
    }
}
