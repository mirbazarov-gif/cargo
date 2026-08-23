import { BodyType, Cargo, CargoType, PackageType, Vehicle } from '../types';

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  tent: 'Тент',
  box: 'Фургон',
  refrigerated: 'Рефрижератор',
  flatbed: 'Бортовой',
  container: 'Контейнеровоз',
  isothermal: 'Изотерм',
  tipper: 'Самосвал',
  other: 'Другое',
};

export const CARGO_TYPE_LABELS: Record<CargoType, string> = {
  food: 'Продукты питания',
  building_materials: 'Строительные материалы',
  furniture: 'Мебель',
  machinery: 'Оборудование / Станки',
  appliances: 'Бытовая техника / Электроника',
  clothing: 'Одежда / Текстиль',
  agriculture: 'Сельхозпродукция',
  industrial: 'Промышленный товар',
  chemical: 'Химия / ADR',
  other: 'Другое',
};

export const PACKAGE_TYPE_LABELS: Record<PackageType, string> = {
  pallets: 'Паллеты',
  boxes: 'Коробки',
  bags: 'Мешки / Биг-бэги',
  bulk: 'Навалом / Насыпной',
  pieces: 'Поштучно',
  container: 'Контейнер',
  other: 'Другое',
};

export interface MatchResult {
  score: number; // 0 to 100
  isCompatible: boolean;
  reasons: string[];
  mismatches: string[];
}

/**
 * Calculates rule-based compatibility score between a Cargo and a Vehicle.
 * Physical constraints (weight, volume, temperature) strictly invalidate mismatching vehicles.
 */
export function calculateMatchScore(cargo: Cargo, vehicle: Vehicle): MatchResult {
  const reasons: string[] = [];
  const mismatches: string[] = [];

  // 1. Hard physical check: Weight
  if (cargo.weightTons > vehicle.capacityTons) {
    mismatches.push(`Вес груза (${cargo.weightTons} т) превышает грузоподъёмность машины (${vehicle.capacityTons} т)`);
    return { score: 0, isCompatible: false, reasons: [], mismatches };
  }

  // 2. Hard physical check: Volume
  if (cargo.volumeM3 > vehicle.volumeM3) {
    mismatches.push(`Объём груза (${cargo.volumeM3} м³) превышает объём кузова (${vehicle.volumeM3} м³)`);
    return { score: 0, isCompatible: false, reasons: [], mismatches };
  }

  let totalScore = 0;

  // Weight Score (Up to 25 pts)
  // Optimal utilization is when cargo weight is 40%-95% of capacity
  const weightRatio = cargo.weightTons / vehicle.capacityTons;
  if (weightRatio >= 0.4 && weightRatio <= 1.0) {
    totalScore += 25;
    reasons.push(`Подходит грузоподъёмность (${vehicle.capacityTons} т / груз ${cargo.weightTons} т)`);
  } else {
    totalScore += 18;
    reasons.push(`Грузоподъёмность достаточна (${vehicle.capacityTons} т)`);
  }

  // Volume Score (Up to 20 pts)
  const volumeRatio = cargo.volumeM3 / vehicle.volumeM3;
  if (volumeRatio >= 0.3 && volumeRatio <= 1.0) {
    totalScore += 20;
    reasons.push(`Подходит объём кузова (${vehicle.volumeM3} м³)`);
  } else {
    totalScore += 15;
    reasons.push(`Объём кузова достаточен (${vehicle.volumeM3} м³)`);
  }

  // Body Type Compatibility (Up to 25 pts)
  const isDirectBodyMatch = cargo.requiredBodyTypes.length === 0 || cargo.requiredBodyTypes.includes(vehicle.bodyType);
  if (isDirectBodyMatch) {
    totalScore += 25;
    reasons.push(`Подходит тип кузова (${BODY_TYPE_LABELS[vehicle.bodyType]})`);
  } else {
    // If cargo strictly requires refrigerated and vehicle is tent
    if (cargo.requiredBodyTypes.includes('refrigerated') && vehicle.bodyType !== 'refrigerated') {
      mismatches.push('Требуется рефрижератор с температурным режимом');
      return { score: 0, isCompatible: false, reasons: [], mismatches };
    }
    totalScore += 8;
    reasons.push(`Кузов ${BODY_TYPE_LABELS[vehicle.bodyType]} (возможна адаптация)`);
  }

  // Location / Route Compatibility (Up to 15 pts)
  const sameCity = vehicle.currentCity.toLowerCase() === cargo.originCity.toLowerCase();
  if (sameCity) {
    totalScore += 15;
    reasons.push(`Машина находится в городе загрузки (${vehicle.currentCity})`);
  } else {
    totalScore += 8;
    reasons.push(`Машина в регионе (${vehicle.currentCity})`);
  }

  // Availability & Date Match (Up to 10 pts)
  if (vehicle.status === 'available') {
    totalScore += 10;
    reasons.push(`Машина свободна и готова к подаче`);
  } else if (vehicle.status === 'soon_available') {
    totalScore += 5;
    reasons.push(`Машина освобождается в ближайшее время`);
  }

  // Special Requirements
  if (cargo.requiresTailLift) {
    if (vehicle.hasTailLift) {
      totalScore += 5;
      reasons.push(`Оснащён гидробортом`);
    } else {
      mismatches.push('Требуется гидроборт');
    }
  }

  if (cargo.isTemperatureControlled) {
    if (vehicle.isTemperatureControlled) {
      totalScore += 5;
      reasons.push(`Имеется климат-контроль (-18°C..+20°C)`);
    } else {
      mismatches.push('Требуется контроль температуры');
    }
  }

  if (cargo.isAdr) {
    if (vehicle.isAdr) {
      totalScore += 5;
      reasons.push(`Допуск перевозки опасных грузов (ADR)`);
    } else {
      mismatches.push('Требуется допуск ADR');
    }
  }

  // Carrier Trust boost (+5 pts for top rated carriers)
  if (vehicle.carrierRating >= 4.8 && vehicle.carrierVerified) {
    totalScore += 5;
    reasons.push(`Высокий рейтинг перевозчика ★ ${vehicle.carrierRating}`);
  }

  // Bound score between 40% and 99% if compatible
  const finalScore = Math.min(99, Math.max(50, totalScore));

  return {
    score: finalScore,
    isCompatible: mismatches.length === 0,
    reasons: reasons.slice(0, 5),
    mismatches,
  };
}

export function formatPrice(price: number, currency: string = 'сом'): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ' + (currency === 'KGS' ? 'сом' : currency);
}

export function formatWeight(tons: number): string {
  return tons < 1 ? `${Math.round(tons * 1000)} кг` : `${tons} т`;
}

export function formatVolume(volume: number): string {
  return `${volume} м³`;
}
