"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PixPaymentProps {
    preferenceId: string;
    initPoint: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function PixPayment({ preferenceId, initPoint, onSuccess, onCancel }: PixPaymentProps) {
    const t = useTranslations("pixPayment");
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        // Abrir o checkout do Mercado Pago em nova aba
        window.open(initPoint, '_blank');

        // Iniciar polling para verificar se o pagamento foi concluído
        const pollInterval = setInterval(checkPaymentStatus, 5000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [initPoint]);

    const checkPaymentStatus = async () => {
        try {
            setChecking(true);
            const { getAuth } = await import("firebase/auth");
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) return;

            // Verificar se o usuário foi atualizado para premium
            const { getDatabase, ref, get } = await import("firebase/database");
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.isPremium) {
                    toast.success(t("success"));
                    setTimeout(() => onSuccess(), 1500);
                }
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Instruções */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm">{t("instructions.title")}</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>{t("instructions.step1")}</li>
                    <li>{t("instructions.step2")}</li>
                    <li>{t("instructions.step3")}</li>
                </ol>
            </div>

            {/* Botão para reabrir checkout */}
            <Button
                onClick={() => window.open(initPoint, '_blank')}
                variant="outline"
                className="w-full"
            >
                <ExternalLink className="mr-2 h-4 w-4" />
                Reabrir Página de Pagamento
            </Button>

            {/* Status */}
            <div className="flex items-center justify-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                <span className="text-muted-foreground">
                    {checking ? "Verificando pagamento..." : t("waitingPayment")}
                </span>
            </div>

            {/* Botão Cancelar */}
            <Button
                onClick={onCancel}
                variant="outline"
                className="w-full"
            >
                {t("cancel")}
            </Button>
        </div>
    );
}
