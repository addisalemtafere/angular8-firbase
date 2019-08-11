import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {exhaustMap, map, take, tap} from 'rxjs/operators';

import {Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
import {AuthService} from '../Auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private authService: AuthService,
              private recipeService: RecipeService) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://ng-course-recipe-book-8011a.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }



  fetchRecipes() {

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http
          .get<Recipe[]>(
            'https://ng-course-recipe-book-8011a.firebaseio.com/recipes.json',
            {
              params: new HttpParams().set('auth', user.token)
            });
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }), tap(recipes => {
        this.recipeService.setRecipes(recipes);

      }));


  }
}
