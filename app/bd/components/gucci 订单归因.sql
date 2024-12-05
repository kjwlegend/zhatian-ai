select
  *
from
  t_mem_sales_loger
limit
  10;
-- 查询会显示每个用户的所有订单及其对应的最近绑定时间
SELECT
  t1.account_id,
  t1.order_no,
  t1.order_time,
  t1.binding_time,
  TIMESTAMPDIFF(HOUR, t1.binding_time, t1.order_time) AS time_diff_hours
FROM
  (
    SELECT
      o.account_id,
      o.order_no,
      o.create_time as order_time,
      (
        SELECT
          b.create_time
        FROM
          t_mem_sales_loger b
        WHERE
          b.account_id = o.account_id
          AND b.create_time <= o.create_time
          AND b.log_type IN ('销售绑定', '更新绑定', '新建绑定')
        ORDER BY
          b.create_time DESC
        LIMIT
          1
      ) as binding_time
    FROM
      t_mem_sales_loger o
    WHERE
      o.create_time >= '2023-01-01'
      AND o.order_no IS NOT NULL
  ) t1
WHERE
  t1.binding_time IS NOT NULL
ORDER BY
  t1.account_id,
  t1.order_time DESC;
-- 输出订单号
SELECT
  CASE
    WHEN time_diff_hours < 0 THEN '无效订单'
    WHEN time_diff_hours <= 24 THEN '24小时'
    WHEN time_diff_hours <= 168 THEN '7天以内'
    WHEN time_diff_hours <= 720 THEN '30天以内'
    ELSE '30天以上'
  END AS time_group,
  account_id,
  order_no,
  order_time,
  binding_time,
  time_diff_hours
FROM
  (
    SELECT
      t1.account_id,
      t1.order_no,
      t1.order_time,
      t1.binding_time,
      TIMESTAMPDIFF(HOUR, t1.binding_time, t1.order_time) AS time_diff_hours
    FROM
      (
        SELECT
          o.account_id,
          o.order_no,
          o.create_time as order_time,
          (
            SELECT
              b.create_time
            FROM
              t_mem_sales_loger b
            WHERE
              b.account_id = o.account_id
              AND b.create_time <= o.create_time
              AND b.log_type IN ('销售绑定', '更新绑定', '新建绑定')
            ORDER BY
              b.create_time DESC
            LIMIT
              1
          ) as binding_time
        FROM
          t_mem_sales_loger o
        WHERE
          o.create_time >= '2024-01-01'
          AND o.order_no IS NOT NULL
      ) t1
    WHERE
      t1.binding_time IS NOT NULL
  ) temp_table
ORDER BY
  time_group,
  order_time DESC;
  
-- 订单表查询
select
  order_number,
  order_line_loc_am,
  order_date,
  order_line_unit_loc_am,
  trade_event_code
from
  t_ft_order_line
where
  order_line_loc_am IS NOT null
order by
  create_time desc
limit
  100;
-- final
SELECT
  CASE
    WHEN time_diff_hours < 0 THEN '无效订单'
    WHEN time_diff_hours <= 24 THEN '24小时'
    WHEN time_diff_hours <= 168 THEN '7天以内'
    WHEN time_diff_hours <= 720 THEN '30天以内'
    ELSE '30天以上'
  END AS time_group,
  COUNT(DISTINCT temp_table.order_no) AS order_count,
  SUM(o.order_line_unit_loc_am) AS total_amount
FROM
  (
    SELECT
      t1.account_id,
      t1.order_no,
      t1.order_time,
      t1.binding_time,
      TIMESTAMPDIFF(HOUR, t1.binding_time, t1.order_time) AS time_diff_hours
    FROM
      (
        SELECT
          o.account_id,
          o.order_no,
          o.create_time as order_time,
          (
            SELECT
              b.create_time
            FROM
              t_mem_sales_loger b
            WHERE
              b.account_id = o.account_id
              AND b.create_time <= o.create_time
              AND b.log_type IN ('销售绑定', '更新绑定', '新建绑定')
            ORDER BY
              b.create_time DESC
            LIMIT
              1
          ) as binding_time
        FROM
          t_mem_sales_loger o
        WHERE
          o.create_time >= '2024-01-01'
          AND o.order_no IS NOT NULL
      ) t1
    WHERE
      t1.binding_time IS NOT NULL
  ) temp_table
  LEFT JOIN t_ft_order_line o ON temp_table.order_no = o.order_number
GROUP BY
  CASE
    WHEN time_diff_hours < 0 THEN '无效订单'
    WHEN time_diff_hours <= 24 THEN '24小时'
    WHEN time_diff_hours <= 168 THEN '7天以内'
    WHEN time_diff_hours <= 720 THEN '30天以内'
    ELSE '30天以上'
  END
ORDER BY
  CASE
    time_group
    WHEN '24小时' THEN 1
    WHEN '7天以内' THEN 2
    WHEN '30天以内' THEN 3
    WHEN '30天以上' THEN 4
    WHEN '无效订单' THEN 5
  END;