-- Up 
CREATE TABLE plugin_data (
  plugin TEXT,
  key TEXT,
  value TEXT,
  PRIMARY KEY (plugin, key)
);
 
-- Down 
DROP TABLE plugin_data
