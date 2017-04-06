package com.wiseonline.Service;

/**
 * Created by yanwj on 2015/11/6.
 */
import com.wiseonline.Utils.PageResult;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.LogicalExpression;
import org.hibernate.criterion.SimpleExpression;

import java.util.List;
import java.util.Map;

public interface BaseDaoService<T> {

    SessionFactory CreateSessionFactory();

    /**
     * 判断Key的值是否已存在 <br>
     * ------------------------------<br>
     *
     * @param key
     * @param value
     * @param objectid
     * @return
     */
    boolean IsExistName(String key, String value, int objectid);

    T getbyId(int id);

    boolean save(T st);

    boolean saveOrUpdate(T st);

    boolean saveGetID(T st);

    boolean save(List<T> st);

    boolean delete(T obj);

    boolean delete(int id);

    boolean delete(List<Integer> id);

    boolean delete(String id);

    boolean update(T model);

    boolean update(List<T> model);

    boolean execSql(String sql);
    boolean execDataSql(String sql);

    List<T> findAll();

    /**
     * 分页获取所有模型对象
     *
     * @param page
     *            页码 从1开始
     * @param pageSize
     *            每页记录数
     * @return
     */
    PageResult<T> findAll(int page, int pageSize, T model);

    /**
     * 分页获取所有模型对象
     *
     * @param page
     *            页码 从1开始
     * @param pageSize
     *            每页记录数
     * @param desc
     *            降序
     * @param orderField
     *            排序字段
     * @return
     */
    PageResult<T> findAll(int page, int pageSize, T model, boolean desc,
                          String orderField);

    PageResult<T> findByExpression(int page, int pageSize,
                                   SimpleExpression expression);

    PageResult<T> findByExpression(int page, int pageSize,
                                   SimpleExpression expression, boolean desc, String orderField);

    PageResult<T> findByCriterion(int page, int pageSize, Criterion criterion,
                                  boolean desc, String orderField);

    PageResult<T> findByExpression_logical(int page, int pageSize,
                                           List<SimpleExpression> expressions,List<LogicalExpression> expression2,boolean desc, String orderField);

    List<T> findBySQL(String sql);

    List<T> findByDataSQL(String sql);

    List<Object[]> findByCustomerSQL(String sql);

    int getCountBySQL(String sql);

    int getCountByExpression(List<SimpleExpression> expressions);
    int getCountByExpression(List<SimpleExpression> expressions,List<LogicalExpression> list2);

   /* Geometry ConvertJosnToGeo(String geoJson);*/

    /**
     * 根据 一个字段查询结果集
     *
     * @param page
     * @param pageSize
     * @param FieldName
     * @param FieldValue
     * @param desc
     * @param orderField
     * @return
     */
    PageResult<T> findByOneField(int page, int pageSize, String FieldName,
                                 String FieldValue, boolean desc, String orderField);
    PageResult<T> findByOneField(int page, int pageSize, String FieldName,
                                 int FieldValue, boolean desc, String orderField,T model);

    PageResult<T> findByOneField(int page, int pageSize,
                                 Map map, boolean unequal, boolean desc, String orderField, T model);
}