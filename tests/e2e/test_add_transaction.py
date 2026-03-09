import sys
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

def run_e2e_tests():
    print("Starting E2E tests for Add Transaction...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser error: {err}"))
        
        try:
            print("1. Navigating to Add Transaction sandbox page...")
            page.goto('http://localhost:3000/sandbox-e2e', wait_until="networkidle")
            
            # Print page title to debug
            print(f"Page Title: {page.title()}")
            print(f"Current URL: {page.url}")
            
            # Wait for the spinner to go away if it's there
            print("2. Waiting for loading to finish...")
            try:
                page.wait_for_selector('text=Preparando formulario...', state='hidden', timeout=10000)
            except Exception:
                pass # Might load too fast
                
            # Verify basic elements are present
            print("3. Verifying default state (Gasto)...")
            expense_btn = page.get_by_role("button", name="Gasto", exact=True)
            income_btn = page.get_by_role("button", name="Ingreso", exact=True)
            
            # Use wait_for to avoid race conditions with React rendering
            expense_btn.wait_for(state="visible", timeout=5000)
            income_btn.wait_for(state="visible", timeout=5000)
            
            assert expense_btn.is_visible(), "Expense button should be visible"
            
            # Since Expense is default, check for Expense-specific fields
            print("4. Checking expense specific fields...")
            category_select = page.locator('select', has_text='Categoría').first
            # Nature toggle
            nature_fixed = page.locator('button:has-text("Fijo")')
            nature_variable = page.locator('button:has-text("Variable")')
            nature_fixed.first.wait_for(state="visible", timeout=5000)
            
            print("5. Toggling to Income (Ingreso)...")
            income_btn.click()
            
            # Wait for source input
            source_input = page.locator('input[placeholder="Ej. Sueldo, Freelance..."]')
            source_input.wait_for(state="visible", timeout=2000)
            
            print("6. Testing amount input and currency conversion...")
            # Target the amount input
            amount_input = page.locator('input[placeholder="0"]')
            amount_input.fill('1500')
            
            # Currency conversion should show up
            currency_display = page.locator('button[title="Cambiar moneda principal"]')
            currency_display.wait_for(state="visible")
            text_content = currency_display.text_content()
            print(f"Currency conversion display: {text_content.strip()}")
            
            assert "USD" in text_content or "US$" in text_content, "Currency conversion should be displayed"
            
            print("7. Testing validation (empty submits)...")
            # Clear amount
            amount_input.fill('')
            submit_btn = page.locator('button[type="submit"]')
            
            # Button should be disabled when form is invalid (amount is empty)
            assert submit_btn.is_disabled(), "Submit button should be disabled when amount is empty"
            print("Validation correctly prevented submission (button disabled).")
            
            print("Tests passed successfully!")
            return True
            
        except AssertionError as e:
            print(f"TEST FAILED: {str(e)}")
            page.screenshot(path="error_screenshot.png", full_page=True)
            return False
        except Exception as e:
            print(f"ERROR: {str(e)}")
            with open('failed_html_dump.html', 'w', encoding='utf-8') as f:
                f.write(page.content())
            page.screenshot(path="error_screenshot.png", full_page=True)
            return False
        finally:
            browser.close()

if __name__ == "__main__":
    success = run_e2e_tests()
    sys.exit(0 if success else 1)
