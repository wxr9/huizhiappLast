package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.ServiceInfo;
import com.wiseonline.Service.ServiceInfoService;
import org.springframework.stereotype.Service;

/**
 * Created by yanwj on 2015/11/9.
 */
@Service("serviceInfoService")
public class ServiceInfoServiceImpl extends BaseDaoServiceImpl<ServiceInfo> implements ServiceInfoService{
}
