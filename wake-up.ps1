# ============================================================
# WAKE-UP SCRIPT — TOEFL Prep Autonomous Execution
# Tokens renovam: 20:30 / 01:30 / 06:30 / 11:30 / 16:30 BRT
# Uso: Start-Process powershell -ArgumentList "-File wake-up.ps1" -WindowStyle Minimized
# Deixe rodando em segundo plano. Acorda o terminal no proximo
# horario de renovacao e digita "Continue" automaticamente.
# ============================================================

$renewalTimes = @("01:30", "06:30", "11:30", "16:30", "20:30")
$bufferMinutes = 3

function Get-NextRenewal {
    $now = Get-Date
    $today = $now.Date
    $nextTime = $null

    foreach ($t in $renewalTimes) {
        $candidate = [DateTime]::ParseExact("$($today.ToString('yyyy-MM-dd')) $t", "yyyy-MM-dd HH:mm", $null)
        $candidate = $candidate.AddMinutes($bufferMinutes)
        if ($candidate -gt $now) {
            if ($null -eq $nextTime -or $candidate -lt $nextTime) {
                $nextTime = $candidate
            }
        }
    }

    if ($null -eq $nextTime) {
        $tomorrow = $today.AddDays(1)
        $t = $renewalTimes[0]
        $nextTime = [DateTime]::ParseExact("$($tomorrow.ToString('yyyy-MM-dd')) $t", "yyyy-MM-dd HH:mm", $null)
        $nextTime = $nextTime.AddMinutes($bufferMinutes)
    }

    return $nextTime
}

while ($true) {
    $next = Get-NextRenewal
    $waitSeconds = [int]($next - (Get-Date)).TotalSeconds

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  WAKE-UP TIMER ATIVO" -ForegroundColor Cyan
    Write-Host "  Proximo wake-up: $($next.ToString('dd/MM/yyyy HH:mm')) BRT" -ForegroundColor Yellow
    Write-Host "  Aguardando: $([int]($waitSeconds/3600))h $([int](($waitSeconds%3600)/60))min $($waitSeconds%60)s" -ForegroundColor Yellow
    Write-Host "  (Mantenha esta janela aberta)" -ForegroundColor Gray
    Write-Host "============================================" -ForegroundColor Cyan

    Start-Sleep -Seconds $waitSeconds

    Write-Host ""
    Write-Host ">>> TOKENS RENOVADOS — Acordando Claude Code..." -ForegroundColor Green

    $wshell = New-Object -ComObject wscript.shell
    Start-Sleep -Seconds 3

    $targetWindows = @("Claude", "Visual Studio Code", "Windows PowerShell", "Terminal", "pwsh")
    $activated = $false

    foreach ($title in $targetWindows) {
        $result = $wshell.AppActivate($title)
        if ($result) {
            $activated = $true
            Write-Host "Janela '$title' ativada." -ForegroundColor Green
            break
        }
    }

    if (-not $activated) {
        Write-Host "ATENCAO: Nao foi possivel ativar a janela automaticamente." -ForegroundColor Red
        Write-Host "Clique na janela do Claude Code e pressione Enter manualmente." -ForegroundColor Yellow
    } else {
        Start-Sleep -Seconds 1
        $resumeMsg = "Leia o PROGRESSO.md e retome a execucao autonoma a partir do ultimo arquivo marcado como pendente. Nao peca autorizacoes. Continue sem parar ate todos os 20 arquivos SQL estarem criados, depois crie TAREFAS_MANUAIS.md, TESTE.md, faca git commit e push, e dispare o webhook final."
        $wshell.SendKeys($resumeMsg)
        Start-Sleep -Milliseconds 500
        $wshell.SendKeys("{ENTER}")
        Write-Host "Mensagem de retomada enviada." -ForegroundColor Green
    }

    Write-Host "Aguardando proximo ciclo..." -ForegroundColor Cyan
    Start-Sleep -Seconds 60
}
