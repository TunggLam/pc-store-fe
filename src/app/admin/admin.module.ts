import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import {SharedModule} from "../shared/shared.module";
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import {NgxPaginationModule} from "ngx-pagination";
import {MatCardModule} from "@angular/material/card";
import { ProductListComponent } from './product/product-list/product-list.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgSwitcheryModule} from "angular-switchery-ios";
import { CategoryDetailComponent } from './categories/category-detail/category-detail.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import {MatInputModule} from "@angular/material/input";
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CategoryUpdateComponent } from './categories/category-update/category-update.component';
import {ShowValidateErrorComponent} from "../common/show-validate-error/show-validate-error.component";
import { ProductUpdateComponent } from './product/product-update/product-update.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';



@NgModule({
  declarations: [
    HomeComponent,
    UserListComponent,
    UserEditComponent,
    UserDetailComponent,
    ProductListComponent,
    CategoryListComponent,
    CreateCategoryComponent,
    CategoryDetailComponent,
    CreateProductComponent,
    ProductDetailComponent,
    CategoryUpdateComponent,
    ProductUpdateComponent,
    OrderListComponent,
    OrderDetailComponent

  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        NgxPaginationModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggleModule,
        NgSwitcheryModule,
        MatInputModule,
        ShowValidateErrorComponent,
        NgChartsModule
    ]
})
export class AdminModule { }
