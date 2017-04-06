package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.Course;
import com.wiseonline.Service.CourseService;
import org.springframework.stereotype.Service;

/**
 * Created by yanwj on 2016/3/3.
 */
@Service("courseService")
public class CourseServiceImpl extends BaseDaoServiceImpl<Course> implements CourseService {
}
