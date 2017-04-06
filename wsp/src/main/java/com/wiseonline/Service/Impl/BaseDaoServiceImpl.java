package com.wiseonline.Service.Impl;

/**
 * Created by yanwj on 2015/11/6.
 */
import com.wiseonline.Dao.BaseDao;
import com.wiseonline.Service.BaseDaoService;
import com.wiseonline.Utils.PageResult;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.LogicalExpression;
import org.hibernate.criterion.SimpleExpression;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class BaseDaoServiceImpl<T> implements BaseDaoService<T> {
    @Autowired
    public BaseDao<T> baseDao;

    private Class<T> t;

    public SessionFactory CreateSessionFactory() {
        return CreateSessionFactory();
    }

    public BaseDaoServiceImpl() {
        Type genType = getClass().getGenericSuperclass();
        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();
        t = (Class<T>) params[0];
    }

    public boolean save(T st) {
        return baseDao.save(st);
    }

    public boolean saveOrUpdate(T st) {
        return baseDao.saveOrUpdate(st);
    }

    public boolean saveGetID(T st) {
        return baseDao.saveGetID(st);
    }

    public boolean save(List<T> st) {
        return baseDao.save(st);
    }

    public boolean delete(T obj) {
        return baseDao.delete(obj);
    }

    public boolean delete(int id) {
        return baseDao.delete(id, t);
    }

    public boolean delete(List<Integer> id) {
        return baseDao.delete(id, t);
    }

    public boolean delete(String id) {
        return baseDao.delete(id, t);
    }

    public List<T> findAll() {
        return baseDao.findAll(t);
    }

    public PageResult<T> findAll(int page, int pageSize, T model, boolean desc,
                                 String orderField) {
        return baseDao.findAll(t, GetPR(page, pageSize), model, desc,
                orderField);
    }

    public PageResult<T> findAll(int page, int pageSize, T model) {

        return baseDao.findAll(t, GetPR(page, pageSize), model);
    }

    public PageResult<T> findByExpression(int page, int pageSize,
                                          SimpleExpression expression) {

        return baseDao.findByExpression(t, GetPR(page, pageSize), expression);
    }

    public PageResult<T> findByExpression(int page, int pageSize,
                                          SimpleExpression expression, boolean desc, String orderField) {
        return baseDao.findByExpression(t,  GetPR(page,pageSize), expression, desc, orderField);
    }

    public PageResult<T> findByExpression(int page, int pageSize,
                                          List<SimpleExpression> expression, boolean desc, String orderField) {
        return baseDao.findByExpression(t,  GetPR(page,pageSize), expression, desc, orderField);
    }

    public PageResult<T> findByExpression_logical(int page, int pageSize,
                                                  List<SimpleExpression> expressions,List<LogicalExpression> expression2,boolean desc, String orderField) {
        return baseDao.findByExpression_logical(t,  GetPR(page,pageSize), expressions,expression2, desc, orderField);
    }

    public PageResult<T> findByCriterion(int page, int pageSize,
                                         Criterion criterion, boolean desc, String orderField) {
        return baseDao.findByCriterion(t,  GetPR(page,pageSize), criterion, desc, orderField);
    }

    public boolean update(T model) {
        return baseDao.update(model);
    }

    public boolean update(List<T> model) {
        return baseDao.update(model);
    }

    public boolean execSql(String sql) {
        return baseDao.execSql(sql);
    }

    public boolean execDataSql(String sql) {
        return baseDao.execDataSql(sql);
    }

    public T getbyId(int id) {
        return (T) baseDao.getbyId(id, t);
    }

    public T getbyId(String id) {
        return (T) baseDao.getbyId(id, t);
    }

    public List<T> findBySQL(String sql) {
        return baseDao.findBySQL(sql);
    }

    public List<T> findByDataSQL(String sql) {
        return baseDao.findByDataSQL(sql,t);
    }

    public List<Object[]> findByCustomerSQL(String sql) {
        return baseDao.findByCustomerSQL(sql);
    }

    public int getCountBySQL(String sql) {
        return baseDao.getCountBySQL(sql);
    }

    public boolean IsExistName(String key, String value, int objectid) {
        String sql = "from " + t.getSimpleName() + " where " + key + "='"
                + value + "'";
        if (objectid > 0) {
            sql = sql + " and objectid <> " + objectid;
        }
        List<T> objs = baseDao.findBySQL(sql);
        if (!objs.isEmpty()) {
            return true;
        }
        return false;
    }

   /* public Geometry ConvertJosnToGeo(String geoJson) {
        GeometryJSON g = new GeometryJSON();
        Geometry shape = null;
        try {
            shape = g.read(geoJson);
            shape.setSRID(4610);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return shape;
    }*/

    public PageResult<T> findByOneField(int page, int pageSize,
                                        String FieldName, String FieldValue, boolean desc, String orderField) {
        return baseDao.findByOneField(t, GetPR(page, pageSize), FieldName,FieldValue,
                desc, orderField);
    }
    public PageResult<T> findByOneField(int page, int pageSize,
                                        String FieldName, int FieldValue, boolean desc, String orderField,T model) {
        return baseDao.findByOneField(t, GetPR(page, pageSize), FieldName,FieldValue,
                desc, orderField,model);
    }

    public PageResult<T> findByOneField(int page, int pageSize,
                                        Map map, boolean unequal,boolean desc, String orderField,T model){
        return baseDao.findByOneField(t,GetPR(page, pageSize),map,unequal,desc,orderField,model);
    }

    private PageResult<T> GetPR(int page, int pageSize) {
        PageResult<T> pr = new PageResult<T>();
        pr.setPage(page);
        pr.setPagesize(pageSize);
        return pr;
    }

    public int getCountByExpression(List<SimpleExpression> expressions) {
        // TODO Auto-generated method stub
        return baseDao.getCountByExpression(t,expressions);
    }

    public int getCountByExpression(List<SimpleExpression> expressions,List<LogicalExpression> list2) {
        // TODO Auto-generated method stub
        return baseDao.getCountByExpression(t,expressions,list2);
    }

}
