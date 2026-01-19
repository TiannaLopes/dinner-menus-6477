import { load } from 'cheerio'
import axios from 'axios'
import type { ScrapedRecipe } from '~/types/database'

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })

    const $ = load(response.data)
    let recipe: Partial<ScrapedRecipe> = {
      sourceUrl: url,
      title: '',
      ingredients: [],
      instructions: []
    }

    // Try to find JSON-LD structured data first
    const jsonLd = $('script[type="application/ld+json"]').html()
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd)
        const recipeData = Array.isArray(data) 
          ? data.find(item => item['@type'] === 'Recipe')
          : data['@type'] === 'Recipe' ? data : null

        if (recipeData) {
          recipe.title = recipeData.name || ''
          recipe.ingredients = Array.isArray(recipeData.recipeIngredient) 
            ? recipeData.recipeIngredient 
            : []
          recipe.instructions = Array.isArray(recipeData.recipeInstructions)
            ? recipeData.recipeInstructions.map((step: any) => 
                typeof step === 'string' ? step : step.text || ''
              )
            : []
          recipe.prepTime = parseDuration(recipeData.prepTime)
          recipe.cookTime = parseDuration(recipeData.cookTime)
          recipe.servings = parseInt(recipeData.recipeYield) || undefined
          recipe.imageUrl = recipeData.image?.url || recipeData.image || undefined
        }
      } catch (e) {
        console.error('Error parsing JSON-LD:', e)
      }
    }

    // Fallback to HTML parsing if JSON-LD didn't work
    if (!recipe.title) {
      recipe.title = $('h1').first().text().trim() || 
                     $('[class*="recipe-title"]').first().text().trim() ||
                     $('title').text().trim()
    }

    if (recipe.ingredients.length === 0) {
      const ingredientSelectors = [
        '.recipe-ingredient',
        '[class*="ingredient"]',
        'li[itemprop="recipeIngredient"]',
        '.ingredients li'
      ]
      
      ingredientSelectors.forEach(selector => {
        if (recipe.ingredients!.length === 0) {
          $(selector).each((_, el) => {
            const text = $(el).text().trim()
            if (text && text.length > 2) {
              recipe.ingredients!.push(text)
            }
          })
        }
      })
    }

    if (recipe.instructions.length === 0) {
      const instructionSelectors = [
        '.recipe-instruction',
        '[class*="instruction"]',
        'li[itemprop="recipeInstructions"]',
        '.instructions li',
        '.directions li'
      ]
      
      instructionSelectors.forEach(selector => {
        if (recipe.instructions!.length === 0) {
          $(selector).each((_, el) => {
            const text = $(el).text().trim()
            if (text && text.length > 10) {
              recipe.instructions!.push(text)
            }
          })
        }
      })
    }

    // If still no instructions, try to get all p tags in instruction-like containers
    if (recipe.instructions.length === 0) {
      $('[class*="instruction"], [class*="direction"], [class*="method"]').find('p').each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 10) {
          recipe.instructions!.push(text)
        }
      })
    }

    if (!recipe.title || recipe.ingredients.length === 0) {
      throw createError({
        statusCode: 422,
        message: 'Could not extract recipe data from this URL. Please try manual entry.'
      })
    }

    return recipe as ScrapedRecipe
  } catch (error: any) {
    console.error('Scraping error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to scrape recipe'
    })
  }
})

function parseDuration(duration?: string): number | undefined {
  if (!duration) return undefined
  const match = duration.match(/PT(\d+)H?(\d+)?M/)
  if (match) {
    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    return hours * 60 + minutes
  }
  return undefined
}
