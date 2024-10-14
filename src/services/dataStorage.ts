import { format } from 'date-fns';

// ... (keep all the existing interfaces)

class DataStorage {
  private players: Player[] = [];
  private recharges: Recharge[] = [];
  private settlements: Settlement[] = [];
  private coinReplenishments: CoinReplenishment[] = [];
  private hosts: Host[] = [];
  private hostIncomes: HostIncome[] = [];

  constructor() {
    // Initialize with empty arrays
    this.players = [];
    this.recharges = [];
    this.settlements = [];
    this.coinReplenishments = [];
    this.hosts = [];
    this.hostIncomes = [];
  }

  // ... (keep all the existing methods)

  getDailyRevenueData(): { hour: string; giftValue: number }[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySettlements = this.settlements.filter(
      settlement => new Date(settlement.date_time) >= today && new Date(settlement.date_time) < tomorrow
    );

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      giftValue: 0
    }));

    todaySettlements.forEach(settlement => {
      const hour = new Date(settlement.date_time).getHours();
      hourlyData[hour].giftValue += settlement.gift_value;
    });

    return hourlyData;
  }

  // Add methods to get and set settlements
  getSettlements(): Settlement[] {
    return this.settlements;
  }

  addSettlement(settlement: Settlement): void {
    this.settlements.push(settlement);
  }

  // ... (keep all other methods)

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getCurrentDateTime(): string {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }
}

// Export the dataStorage instance
export const dataStorage = new DataStorage();

// Export individual functions for components that need them
export const {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getRecharges,
  addRecharge,
  getSettlements,
  addSettlement,
  getCoinReplenishments,
  addCoinReplenishment,
  getHosts,
  addHost,
  updateHost,
  getDailyRevenueData,
  generateId,
  getCurrentDateTime,
  getHostIncomes,
  addHostIncome
} = dataStorage;

// Export the HostIncome interface
export type { HostIncome, Settlement, CoinReplenishment, Host, Player, Recharge };