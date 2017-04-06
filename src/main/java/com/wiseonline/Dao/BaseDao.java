package com.wiseonline.Dao;

import com.wiseonline.Utils.PageResult;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.LogicalExpression;
import org.hibernate.criterion.SimpleExpression;

import java.util.List;
import java.util.Map;
/**
 * Created by yanwj on 2015/11/6.
 */
public interface BaseDao<T> {
    SessionFactory CSessionFactory();

    List<T> findAll(Class<T> t);

    PageResult<T> findAll(Class<T> t, PageResult<T> pr, T model);

    PageResult<T> findAll(Class<T> t, PageResult<T> pr, T model, boolean desc,
                          String orderField);

    /**
     * 根据sql查询
     *
     * @param sql
     * @return
     */
    List<T> findBySQL(String sql);

    /**
     * 根据sql查询,数据库sql格式
     * @param sql
     * @param t
     * @return
     */
    List<T> findByDataSQL(String sql,Class<T> t);

    List<Object[]> findByCustomerSQL(String sql);

    /**
     * 查询单个表达式
     *
     * @param t
     * @param pr
     * @param expression
     * @return
     */
    PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                   SimpleExpression expression);

    /**
     * 查询单个表达式并排序
     *
     * @param t
     * @param pr
     * @param expression
     * @param desc
     * @param orderField
     * @return
     */
    PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                   SimpleExpression expression, boolean desc, String orderField);

    /**
     * 查询多个表达式并排序
     *
     * @param t
     * @param pr
     * @param expressions
     * @param desc
     * @param orderField
     * @return
     */
    PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                   List<SimpleExpression> expressions, boolean desc, String orderField);
    PageResult<T> findByExpression_logical(Class<T> t, PageResult<T> pr,
                                           List<SimpleExpression> expressions,List<LogicalExpression> expressions2, boolean desc, String orderField);
    /**
     * 查询单个criterion并排序
     *
     * @param t
     * @param pr
     * @param criterion
     * @param desc
     * @param orderField
     * @return
     */
    PageResult<T> findByCriterion(Class<T> t, PageResult<T> pr,
                                  Criterion criterion, boolean desc, String orderField);

    T getbyId(int Id, Class<T> t);

    T getbyId(String Id, Class<T> t);

    boolean update(T model);

    boolean update(List<T> model);

    boolean delete(T model);

    boolean delete(int id, Class<T> t);

    boolean delete(List<Integer> id, Class<T> t);

    boolean delete(String id, Class<T> t);

    boolean save(T s);

    /**
     * save完需要知道主键使用此方法
     *
     * @param s
     * @return
     */
    boolean saveGetID(T s);

    boolean save(List<T> s);

    /**
     * 插入或更新(数据库自动判断)
     *
     * @param s
     * @return
     */
    boolean saveOrUpdate(T s);

    /**
     * 执行sql语句
     *
     * @param sql
     * @return
     */
    boolean execSql(String sql);
    boolean execDataSql(String sql);

    /**
     * 根据sql返回count数
     *
     * @param sql
     * @return
     */
    int getCountBySQL(String sql);

    /**
     * 根据表达式返回count数
     * @param t
     * @param expressions
     * @return
     */
    int getCountByExpression(Class<T> t, List<SimpleExpression> expressions);
    int getCountByExpression(Class<T> t, List<SimpleExpression> expressions,List<LogicalExpression> logicalExpressions);
    /**
     * 根据 一个字段查询结果集
     *
     * @param t
     * @param pr
     * @param FieldName
     * @param FieldValue
     * @param desc
     * @param orderField
     * @return
     */
    PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                 String FieldName, String FieldValue, boolean desc, String orderField);

    PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                        String FieldName, int FieldValue, boolean desc, String orderField,T model);

    /**
     * 根据 一系列字段查询结果集
     * @param t
     * @param pr
     * @param map
     * @param unequal
     * @param desc
     * @param orderField
     * @param model
     * @return
     */
    PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                        Map map, boolean unequal, boolean desc, String orderField, T model);
}
