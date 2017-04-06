package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.Jobs;
import com.wiseonline.Service.JobsService;
import org.springframework.stereotype.Service;

/**
 * Created by yanwj on 2016/3/10.
 */
@Service("jobsService")
public class JobsServiceImpl extends BaseDaoServiceImpl<Jobs> implements JobsService{
}
