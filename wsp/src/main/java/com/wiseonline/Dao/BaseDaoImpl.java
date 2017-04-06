package com.wiseonline.Dao;

import com.wiseonline.Utils.PageResult;
import org.hibernate.*;
import org.hibernate.criterion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
/**
 * Created by yanwj on 2015/11/6.
 */
@Component
@Repository("baseDao")
public class BaseDaoImpl<T> implements BaseDao<T>  {
    @Autowired
    @Qualifier("sessionFactory")
    private SessionFactory sessionFactory;

    private boolean canClose = false;

    public Session getSession() {
        try {
            Session s = sessionFactory.getCurrentSession();
            canClose = false;
            return s;
        } catch (Exception e) {
            canClose = true;
            return sessionFactory.openSession();
        }
    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public SessionFactory CSessionFactory() {
        return sessionFactory;
    }

    public boolean save(T model) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            s.save(s.merge(model));
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean saveOrUpdate(T model) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            // s = getSession();
            s = sessionFactory.openSession();
            tx = s.beginTransaction();
            s.saveOrUpdate(s.merge(model));
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            // if (canClose) {
            s.close();
            // }
        }
        return rst;
    }

    public boolean saveGetID(T model) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            s.save(model);
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean save(List<T> models) {
        if (models.size() == 0)
            return true;
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            for (T model : models) {
                s.save(s.merge(model));
            }
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    @SuppressWarnings("unchecked")
    public List<T> findAll(Class<T> t) {
        Session s = getSession();
        s.beginTransaction();
        Criteria c = s.createCriteria(t);
        List<T> list = c.list();
        s.getTransaction().commit();
        if (canClose) {
            s.close();
        }
        return list;
    }

    @SuppressWarnings({ "deprecation", "unchecked" })
    public T getbyId(int Id, Class<T> t) {
        Session s = getSession();
        s.beginTransaction();
        Criteria c = s.createCriteria(t);
        c.add(Expression.eq("id", Id));
        List<T> list = c.list();
        s.getTransaction().commit();
        if (canClose) {
            s.close();
        }
        if (!list.isEmpty()) {
            return (T) list.get(0);
        } else {
            return null;
        }
    }

    @SuppressWarnings({ "deprecation", "unchecked" })
    public T getbyId(String Id, Class<T> t) {
        Session s = getSession();
        s.beginTransaction();
        Criteria c = s.createCriteria(t);
        c.add(Expression.eq("id", Id));
        List<T> list = c.list();
        s.getTransaction().commit();
        if (canClose) {
            s.close();
        }
        if (!list.isEmpty()) {
            return (T) list.get(0);
        } else {
            return null;
        }
    }

    public boolean update(T model) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            s.update(s.merge(model));
            s.flush();
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean update(List<T> models) {
        if (models.size() == 0)
            return true;
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            for (T model : models) {
                s.update(s.merge(model));
            }
            s.flush();
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean execSql(String sql) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            Query query = s.createQuery(sql);
            query.executeUpdate();
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean execDataSql(String sql) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            Query query = s.createSQLQuery(sql);
            query.executeUpdate();
            tx.commit();
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean delete(T model) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = sessionFactory.openSession();// getSession();
            tx = s.beginTransaction();
            s.delete(s.merge(model));
            tx.commit(); // 清理缓存，执行delete语句
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            // if (canClose) {
            s.close();
            // }
        }
        return rst;
    }

    public boolean delete(String id, Class<T> t) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            Query query = s.createQuery("delete " + t.getSimpleName()
                    + "  where objectid ='" + id + "'");
            query.executeUpdate();
            tx.commit(); // 清理缓存，执行delete语句
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean delete(List<Integer> ids, Class<T> t) {
        if (ids.size() == 0)
            return true;
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            String sql = ids.toString().replace("[", "(").replace("]", ")");
            Query query = s.createQuery("delete " + t.getSimpleName()
                    + "  where objectid in " + sql);

            query.executeUpdate();
            tx.commit(); // 清理缓存，执行delete语句
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    public boolean delete(int id, Class<T> t) {
        boolean rst = false;
        Session s = null;
        Transaction tx = null;
        try {
            s = getSession();
            tx = s.beginTransaction();
            Query query = s.createQuery("delete " + t.getSimpleName()
                    + "  where objectid =?");
            query.setInteger(0, id);
            query.executeUpdate();
            tx.commit(); // 清理缓存，执行delete语句
            rst = true;
        } catch (HibernateException e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return rst;
    }

    @SuppressWarnings("unchecked")
    public List<T> findBySQL(String sql) {
        Session s = getSession();
        List<T> list = new ArrayList<T>();
        try {
            s.beginTransaction();
            Query query = s.createQuery(sql);
            list = (List<T>) query.list();
            s.getTransaction().commit();
        }catch (HibernateException e) {
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return list;
    }

    @SuppressWarnings("unchecked")
    public List<T> findByDataSQL(String sql, Class<T> t) {
        Session s = getSession();
        List<T> list = new ArrayList<T>();
        try {
            s.beginTransaction();
            Query query = s.createSQLQuery(sql).addEntity(t);
            list = (List<T>) query.list();
            s.getTransaction().commit();
        }catch (HibernateException e) {
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return list;
    }

    public List<Object[]> findByCustomerSQL(String sql) {
        Session s = getSession();
        List<Object[]> list = new ArrayList<Object[]>();
        try {
            s.beginTransaction();
            Query query = s.createSQLQuery(sql);
            list = query.list();
            s.getTransaction().commit();
        }catch (HibernateException e) {
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return list;
    }

    public PageResult<T> findAll(Class<T> t, PageResult<T> pr, T model) {
        return findAll(t, pr, model, false, "");
    }

    public PageResult<T> findAll(Class<T> t, PageResult<T> pr, T model,
                                 boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            criteria = GetExpression(model, criteria);
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    public PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                          SimpleExpression expression) {
        return this.findByExpression(t, pr, expression, false, "");
    }

    public PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                          SimpleExpression expression, boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            criteria.add(expression);

            pr = ExecCriteria(criteria, pr, desc, orderField);

            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    public PageResult<T> findByCriterion(Class<T> t, PageResult<T> pr,
                                         Criterion criterion, boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            criteria.add(criterion);
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    /**
     * 查询表达式(暂支持String,Int字段查询)
     *
     * @param model
     * @param criteria
     * @return
     */
    private Criteria GetExpression(T model, Criteria criteria) {
        // 得到类对象
        Class cla = (Class) model.getClass();
        Field[] fs = cla.getFields();
        for (int i = 0; i < fs.length; i++) {
            Field f = fs[i];
            f.setAccessible(true); // 设置些属性是可以访问的
            Object val;
            try {
                val = f.get(model);
                String type = f.getType().toString();// 得到此属性的类型
                if (type.endsWith("String")) {
                    if (val != null && !val.toString().isEmpty()) {
                        criteria.add(Expression.like(f.getName(), "%" + val
                                + "%"));
                        // System.out.println("name:"+f.getName()+"\t value = "+val);
                    }
                } else if (type.endsWith("int") || type.endsWith("Integer")) {
                    if (val!=null && !val.toString().equals("0")) {
                        String fieldname = f.getName();
                        // 外键约束判断
                        if (fieldname.endsWith("id")) {
                            String temp = fieldname.substring(0,
                                    fieldname.length() - 2);
                            try {
                                Field ff = cla.getField(temp);
                                criteria.add(Expression.eq(temp + ".objectid",
                                        val));
                            } catch (NoSuchFieldException e) {
                                // TODO Auto-generated catch block
                                // e.printStackTrace();
                            } catch (SecurityException e) {
                                // TODO Auto-generated catch block
                                // e.printStackTrace();
                            }
                        } else {
                            criteria.add(Expression.eq(f.getName(), val));
                        }
                        // System.out.println("name:"+f.getName()+"\t value = "+val);
                    }
                } else if (type.endsWith("Date")) {
                    if (val != null) {
                        DateFormat df1 = DateFormat.getDateInstance();// 日期格式，精确到日
                        SimpleDateFormat sdf = new SimpleDateFormat(
                                "yyyy-MM-dd");
                        // 当前时间
                        String current = df1.format(val);
                        criteria.add(Expression.ge(f.getName(),
                                sdf.parse(current)));
                        // 第二天
                        Date dd = sdf.parse(current);
                        Calendar cl = Calendar.getInstance();
                        cl.set(dd.getYear() + 1900, dd.getMonth(), dd.getDate());
                        cl.add(Calendar.DATE, 1);
                        String next = df1.format(cl.getTime());
                        criteria.add(Expression.lt(f.getName(), sdf.parse(next)));
                    }
                } else {
                    // System.out.println(f.getType()+"\t");
                }
            } catch (IllegalArgumentException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }// 得到此属性的值
            catch (ParseException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return criteria;
    }

    public int getCountBySQL(String sql) {
        Session s = getSession();
        s.beginTransaction();
        Query query = s.createSQLQuery(sql);
        int count = ((Number) query.uniqueResult()).intValue();
        s.getTransaction().commit();
        if (canClose) {
            s.close();
        }
        return count;
    }

    public int getCountByExpression(Class<T> t,
                                    List<SimpleExpression> expressions) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            for (SimpleExpression se : expressions) {
                criteria.add(se);
            }
            int count = Integer.parseInt(criteria
                    .setProjection(Projections.rowCount()).uniqueResult()
                    .toString());
            s.getTransaction().commit();
            return count;
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return 0;
    }

    public int getCountByExpression(Class<T> t,
                                    List<SimpleExpression> expressions,
                                    List<LogicalExpression> logicalExpressions) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            for (SimpleExpression se : expressions) {
                criteria.add(se);
            }
            for (LogicalExpression se : logicalExpressions) {
                criteria.add(se);
            }
            int count = Integer.parseInt(criteria
                    .setProjection(Projections.rowCount()).uniqueResult()
                    .toString());
            s.getTransaction().commit();
            return count;
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return 0;
    }

    public PageResult<T> findByExpression(Class<T> t, PageResult<T> pr,
                                          List<SimpleExpression> expressions, boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            for (SimpleExpression se : expressions) {
                criteria.add(se);
            }
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    public PageResult<T> findByExpression_logical(Class<T> t, PageResult<T> pr,
                                                  List<SimpleExpression> expressions,List<LogicalExpression> expressions2, boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));

            for (SimpleExpression se : expressions) {
                criteria.add(se);
            }
            for (LogicalExpression se : expressions2) {
                criteria.add(se);
            }
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    private PageResult<T> ExecCriteria(Criteria criteria, PageResult<T> pr,
                                       boolean desc, String orderField) {
        int rowCount = Integer.parseInt(criteria
                .setProjection(Projections.rowCount()).uniqueResult()
                .toString());
        criteria.setProjection(null);
        if (pr.getPage() > 0) {
            criteria.setFirstResult((pr.getPage() - 1) * pr.getPagesize());
            criteria.setMaxResults(pr.getPagesize());
        }
        if (orderField != null && !orderField.equals("")) {
            if (desc) {
                for (String ss : orderField.split(",")) {
                    criteria.addOrder(Order.desc(ss));
                }
            } else {
                for (String ss : orderField.split(",")) {
                    criteria.addOrder(Order.asc(ss));
                }
            }
        }
        @SuppressWarnings("unchecked")
        List<T> result = criteria.list();
        pr.setTotal(rowCount);
        pr.setResult(result);
        return pr;
    }

    public PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                        String FieldName, String FieldValue, boolean desc, String orderField) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            criteria.add(Expression.eq(FieldName, FieldValue));
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-getTransactionnerated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    public PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                        String FieldName, int FieldValue, boolean desc, String orderField,T model) {
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            criteria = GetExpression(model, criteria);
            criteria.add(Expression.eq(FieldName, FieldValue));
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-getTransactionnerated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }

    public PageResult<T> findByOneField(Class<T> t, PageResult<T> pr,
                                        Map map, boolean unequal, boolean desc, String orderField, T model){
        Criteria criteria;
        Session s = getSession();
        try {
            s.beginTransaction();
            criteria = s.createCriteria(Class.forName(t.getName()));
            if (model != null){
                criteria = GetExpression(model, criteria);
            }
            if (unequal){
                Iterator keyValuePairs = map.entrySet().iterator();
                for (int i=0 ; i < map.size() ; i++){
                    Map.Entry entry = (Map.Entry) keyValuePairs.next();
                    String key = entry.getKey().toString();
                    Object value = entry.getValue();
                    criteria.add(Expression.ne(key, value));
                }
            }else {
                criteria.add(Expression.allEq(map));
            }
            pr = ExecCriteria(criteria, pr, desc, orderField);
            s.getTransaction().commit();
        } catch (HibernateException e) {
            // TODO Auto-getTransactionnerated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (canClose) {
                s.close();
            }
        }
        return pr;
    }
}
