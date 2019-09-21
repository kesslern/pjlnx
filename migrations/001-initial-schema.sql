-- Up 
CREATE TABLE plugin_data (
  id INTEGER PRIMARY KEY, 
  plugin TEXT,
  key TEXT,
  value TEXT
);
 
-- Down 
DROP TABLE plugin_data
