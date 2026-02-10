import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { ShoppingCart, LogOut, User, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../../cases/auth/useAuthStore'
import { Button } from '../ui/button'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Relatórios',
      url: '/reports',
      icon: BarChart3,
      items: [],
    },
    {
      title: 'Cadastros',
      url: '#',
      items: [
        {
          title: 'Categorias',
          url: '/categories',
        },
        {
          title: 'Marcas',
          url: '/brands',
        },
        {
          title: 'Produtos',
          url: '/products',
        },
      ],
    },
    {
      title: 'Vendas',
      url: '#',
      items: [
        {
          title: 'Clientes',
          url: '/customers',
        },
        {
          title: 'Pedidos',
          url: '/orders',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <a href="/">
                <div
                  className="
                                bg-sidebar-primary text-sidebar-foreground
                                flex aspect-square size-8 items-center
                                justify-center rounded-lg
                            "
                >
                  <ShoppingCart className="text-white size-4" />
                </div>
                <div
                  className="
                                flex flex-col gap-0.5 leading-none
                            "
                >
                  <span className="font-medium">E-commerce CMS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="font-medium"
                  >
                    {item.url !== '#' && item.icon && (
                      <>
                        {item.icon === BarChart3 && (
                          <BarChart3
                            className="mr-2"
                            size={18}
                          />
                        )}
                      </>
                    )}
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subitem) => (
                      <SidebarMenuSubItem key={subitem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subitem.url}>{subitem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            <LogOut
              className="mr-2"
              size={16}
            />
            Sair
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
