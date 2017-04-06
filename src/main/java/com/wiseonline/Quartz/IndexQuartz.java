package com.wiseonline.Quartz;

import com.wiseonline.Service.IndexCreateService;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * 首页静态页面定时任务
 * Created by kelsey on 2016-9-18.
 */
@Service("indexquartz")
public class IndexQuartz extends QuartzJobBean {

    private String path;

    IndexCreateService indexCreateService;

    public void setIndexCreateService(IndexCreateService indexCreateService) {
        this.indexCreateService = indexCreateService;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void work() throws IOException {
        indexCreateService.createHtml(this.getClass().getResource("/").getPath() +"../.."+ path);
    }

    @Override
    protected void executeInternal(JobExecutionContext context)
            throws JobExecutionException {
        try {
            this.work();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
