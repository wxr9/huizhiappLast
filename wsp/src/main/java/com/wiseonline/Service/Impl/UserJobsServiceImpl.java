package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.UserJobs;
import com.wiseonline.Service.UserJobsService;
import org.springframework.stereotype.Service;

/**
 * Created by yanwj on 2016/3/10.
 */
@Service("userJobsService")
public class UserJobsServiceImpl extends BaseDaoServiceImpl<UserJobs> implements UserJobsService{
}
