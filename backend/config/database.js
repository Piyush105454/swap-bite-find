const { createClient } = require('@supabase/supabase-js');
const logger = require('../shared/utils/logger');

class DatabaseConnection {
  constructor() {
    this.supabase = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // Test connection
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        throw error;
      }

      this.isConnected = true;
      logger.info('Database connected successfully');
      return this.supabase;
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  getClient() {
    if (!this.isConnected || !this.supabase) {
      throw new Error('Database not connected');
    }
    return this.supabase;
  }

  async disconnect() {
    this.isConnected = false;
    this.supabase = null;
    logger.info('Database disconnected');
  }
}

module.exports = new DatabaseConnection();