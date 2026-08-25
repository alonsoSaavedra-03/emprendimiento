import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LunaProduct {
  id: number;
  name: string;
  category: 'Accesorios' | 'Tecnología' | 'Hogar' | 'Uso Personal' | 'Novedades';
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  description: string;
  rating: number;
  salesCount: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Navigation Tabs: 'brand' (Marca & Visión), 'catalog' (Productos), 'buyer' (Buyer Persona), 'calculator' (Simulador ROI), 'story' (Historia de Éxito)
  readonly activeTab = signal<'brand' | 'catalog' | 'buyer' | 'calculator' | 'story'>('brand');

  // Interactive Toast
  readonly toastMessage = signal<string | null>(null);

  // Selected Category filter for catalog
  readonly catalogCategory = signal<string>('Todos');

  // Catalog Categories
  readonly categories = ['Todos', 'Accesorios', 'Tecnología', 'Hogar', 'Uso Personal', 'Novedades'];

  // Luna Shop Product Catalog (Clean Badges without decorative star/AI symbols)
  readonly products = signal<LunaProduct[]>([
    {
      id: 1,
      name: 'Lámpara Proyector Galaxia LED',
      category: 'Hogar',
      price: 89,
      originalPrice: 119,
      image: 'images/luna_products.jpg',
      badge: 'Más Vendido',
      description: 'Crea una atmósfera cómoda en tu habitación con control remoto y altavoz Bluetooth integrado.',
      rating: 4.9,
      salesCount: 142
    },
    {
      id: 2,
      name: 'Audífonos Inalámbricos Bluetooth Pastel',
      category: 'Tecnología',
      price: 65,
      originalPrice: 85,
      image: 'images/luna_products.jpg',
      badge: 'Oferta Especial',
      description: 'Sonido de alta fidelidad, batería de larga duración y estuche de carga compacto.',
      rating: 4.8,
      salesCount: 210
    },
    {
      id: 3,
      name: 'Humidificador Ultrasónico Luna RGB',
      category: 'Hogar',
      price: 49,
      originalPrice: 69,
      image: 'images/luna_banner.jpg',
      badge: 'Tendencia',
      description: 'Diseño en forma de luna 3D con luz ambiental regulable y difusor de aromas.',
      rating: 5.0,
      salesCount: 98
    },
    {
      id: 4,
      name: 'Set Facial de Cuarzo Rosa & Skincare',
      category: 'Uso Personal',
      price: 55,
      originalPrice: 75,
      image: 'images/luna_banner.jpg',
      badge: 'Recomendado',
      description: 'Rodillo masajeador y piedra Gua Sha de cuarzo natural para cuidado y masaje facial.',
      rating: 4.9,
      salesCount: 175
    },
    {
      id: 5,
      name: 'Organizador de Escritorio Minimalista',
      category: 'Accesorios',
      price: 39,
      originalPrice: 50,
      image: 'images/luna_products.jpg',
      badge: 'Nuevo Stock',
      description: 'Organizador multi-sección para papelería, gadgets y accesorios personales.',
      rating: 4.7,
      salesCount: 84
    }
  ]);

  // Filtered Products
  readonly filteredProducts = computed(() => {
    const cat = this.catalogCategory();
    if (cat === 'Todos') return this.products();
    return this.products().filter(p => p.category === cat);
  });

  // ROI Simulator State for Luna Shop
  readonly initialInvestment = signal<number>(1200); // Stock inicial, packaging, marketing
  readonly unitPrice = signal<number>(25);            // Precio promedio por producto
  readonly unitCost = signal<number>(10);             // Costo promedio de compra a proveedor
  readonly monthlyOverhead = signal<number>(350);      // Gastos fijos (Delivery, Publicidad, Packaging)
  readonly monthlySalesTarget = signal<number>(85);   // Envíos mensuales estimados

  // Reactive Calculations
  readonly grossMarginPerUnit = computed(() => this.unitPrice() - this.unitCost());
  readonly monthlyRevenue = computed(() => this.unitPrice() * this.monthlySalesTarget());
  readonly monthlyGrossProfit = computed(() => this.grossMarginPerUnit() * this.monthlySalesTarget());
  readonly monthlyNetProfit = computed(() => this.monthlyGrossProfit() - this.monthlyOverhead());
  readonly profitMarginPct = computed(() => {
    const rev = this.monthlyRevenue();
    return rev > 0 ? ((this.monthlyNetProfit() / rev) * 100).toFixed(1) : '0';
  });
  readonly breakEvenUnits = computed(() => {
    const margin = this.grossMarginPerUnit();
    return margin > 0 ? Math.ceil(this.monthlyOverhead() / margin) : 0;
  });
  readonly paybackMonths = computed(() => {
    const net = this.monthlyNetProfit();
    return net > 0 ? (this.initialInvestment() / net).toFixed(1) : 'N/A';
  });

  // Order Simulation Modal State
  readonly selectedProductForOrder = signal<LunaProduct | null>(null);
  orderCustomerName = 'Valeria';
  orderCustomerDistrict = 'Miraflores, Lima';

  // Actions
  openOrderModal(product: LunaProduct) {
    this.selectedProductForOrder.set(product);
  }

  closeOrderModal() {
    this.selectedProductForOrder.set(null);
  }

  sendWhatsAppOrder() {
    const product = this.selectedProductForOrder();
    if (!product) return;

    const message = `¡Hola Luna Shop! Mi nombre es ${this.orderCustomerName} y me gustaría realizar el pedido de: "${product.name}" por S/. ${product.price}. Envío para ${this.orderCustomerDistrict}.`;
    const encoded = encodeURIComponent(message);
    
    this.closeOrderModal();
    this.showToast('📱 Redirigiendo a WhatsApp Business de Luna Shop...');
    setTimeout(() => {
      window.open(`https://wa.me/51999999999?text=${encoded}`, '_blank');
    }, 1000);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }
}
