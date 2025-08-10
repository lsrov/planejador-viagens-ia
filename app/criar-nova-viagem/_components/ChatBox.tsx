"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import FinalUi from './FinalUi'

type Message = {
    role: string,
    content: string,
    ui?:string,
}

export type TripInfo = {
    budget: string,
    destination: string,
    duration: string,
    group_size: string,
    origin: string,
    hotels:any,
    itinerary:any
}

interface ChatBoxProps {
    onSugestaoClick?: (texto: string) => void;
    onTripDetail?: (tripDetail?: TripInfo) => void;
}

const ChatBox = forwardRef<{ setInputValue: (value: string) => void }, ChatBoxProps>(({ onSugestaoClick, onTripDetail }, ref) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [tripDetail, setTripDetail] = useState<TripInfo>();

    // Expose setInputValue method to parent
    useImperativeHandle(ref, () => ({
        setInputValue: (value: string) => {
            setUserInput(value);
        }
    }));

    const onSend = async (input?: string) => {
        const textToSend = input !== undefined ? input : userInput;
        // if (!textToSend?.trim()) return;

        setLoading(true);
        setUserInput('');
        const newMsg: Message = {
            role: 'user',
            content: textToSend
        }

        setMessages((prev: Message[]) => [...prev, newMsg]);

        const result = await axios.post('/api/aimodel', {
            messages: [...messages, newMsg],
            isFinal: isFinal
        });

        console.log("TRIP", result.data);

        if (!isFinal) {
            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: result?.data?.resp,
                ui: result?.data?.ui
            }]);
        } else {
            // Se for final, tenta extrair dados do JSON ou do texto amigável
            let tripDetailObj = undefined;
            if (result?.data?.tripPlan) {
                tripDetailObj = {
                    ...result?.data?.tripPlan,
                    hotels: result?.data?.tripPlan?.hotels,
                    itinerary: result?.data?.itinerary
                };
            } else if (result?.data) {
                // Tenta extrair do JSON bruto
                try {
                    const parsed = typeof result?.data === 'string' ? JSON.parse(result?.data) : result?.data;
                    if (parsed?.trip_plan) {
                        tripDetailObj = {
                            ...parsed.trip_plan,
                            hotels: parsed.trip_plan.hotels,
                            itinerary: parsed.itinerary
                        };
                    }
                } catch {}
            }
            // Se não conseguir, tenta extrair via regex do texto amigável
            if (!tripDetailObj && result?.data?.structuredText) {
                const text = result?.data?.structuredText;
                const destination = text.match(/Destino:\s*([^\n]+)/)?.[1]?.trim();
                const duration = text.match(/Duração:\s*([^\n]+)/)?.[1]?.trim();
                const budget = text.match(/Orçamento:\s*([^\n]+)/)?.[1]?.trim();
                const group_size = text.match(/Grupo:\s*([^\n]+)/)?.[1]?.trim();
                tripDetailObj = { destination, duration, budget, group_size };
            }
            setTripDetail(tripDetailObj);
            if (onTripDetail) {
                onTripDetail(tripDetailObj);
            }
            // Adiciona mensagem estruturada amigável
            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: result?.data?.structuredText,
                ui: result?.data?.ui
            }]);
        }
        setLoading(false);
    }

    const RenderGenerativeUi = (ui: string, content: string) => {
    // Regexes mais precisas para identificar perguntas específicas
    const budgetRegex = /\b(orçamento|pretende gastar|faixa de preço|quanto pretende gastar|quanto quer gastar|quanto custa|quanto vai gastar|qual o seu orçamento|qual é o orçamento|qual é o seu orçamento|qual o orçamento)\b/i;
    const groupRegex = /\b(tamanho do grupo|grupo|viajará com quem|viaja com quem|viajará sozinho|viaja sozinho|quantas pessoas|sozinho|dupla|fam[ií]lia|amigos|quantas pessoas vão viajar|quantas pessoas irão viajar|quantas pessoas estarão na viagem)\b/i;
    // BudgetUi aparece apenas quando a pergunta for exclusivamente sobre orçamento
    if (
        ui === 'budget' &&
        content &&
        budgetRegex.test(content) &&
        // Não renderiza se a pergunta também pedir duração, grupo ou outros temas
        !/dias|duração|quanto tempo|quantos dias|grupo|pessoas|quantas pessoas|final|roteiro|atividades|interesse|preferência/i.test(content)
    ) {
        return <BudgetUi onSelectedOption={(v: string) => onSend(v)} />;
    }
    // GroupSizeUi aparece apenas quando a pergunta for exclusivamente sobre grupo
    if (ui === 'groupSize' && content && groupRegex.test(content) && !budgetRegex.test(content)) {
        return <GroupSizeUi onSelectedOption={(v: string) => onSend(v)} />;
    }
    // Só renderiza FinalUi se for realmente finalização
    if (ui === 'final' && !budgetRegex.test(content) && !groupRegex.test(content)) {
        if (loading || !tripDetail) {
            return (
                <div className="flex items-center gap-2 text-gray-500">
                    <Loader className='animate-spin h-4 w-4' />
                    Gerando plano de viagem...
                </div>
            );
        }
        return <FinalUi viewTrip={() => console.log()} tripDetail={tripDetail} />;
    }
    return null;
    }

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        const penultimateMsg = messages[messages.length - 2];
        if (
            lastMsg?.ui === 'final' && lastMsg.role === 'assistant' &&
            !(penultimateMsg?.role === 'user' && penultimateMsg?.content === 'Ok. É isso que eu quero.')
        ) {
            setIsFinal(true);
            // Envia automaticamente a mensagem final do usuário apenas se não foi enviada antes
            setTimeout(() => {
                onSend('Ok. É isso que eu quero.');
            }, 300);
        }
    }, [messages]);

    // Log tripDetail sempre que for atualizado
    useEffect(() => {
        if (tripDetail && onTripDetail) {
            onTripDetail(tripDetail);
        }
    }, [tripDetail, onTripDetail]);

    return (
        <div className="h-[85vh] flex flex-col items-center w-full">
            {/*Mensagens*/}
            <section className="flex-1 overflow-y-auto p-4 w-full flex justify-center">
                <div className="w-full max-w-2xl flex flex-col">
                {messages?.length == 0 ? (
                    <EmptyBoxState onSugestaoClick={(v:string) => onSend(v)} />
                ) : (
                    <>
                        {messages.map((msg: Message, index) => {
                            const showContent = msg.content;
                            // Detecta pergunta de orçamento
                            const isBudget = msg.role === 'assistant' && /orçamento|pretende gastar|faixa de preço|quanto pretende gastar|quanto quer gastar|quanto custa|quanto vai gastar|qual o seu orçamento|qual é o orçamento|qual é o seu orçamento|qual o orçamento/i.test(showContent);
                            // Detecta pergunta de grupo
                            const isGroup = msg.role === 'assistant' && /tamanho do grupo|grupo|viajará com quem|viaja com quem|viajará sozinho|viaja sozinho|quantas pessoas|sozinho|dupla|fam[ií]lia|amigos|quantas pessoas vão viajar|quantas pessoas irão viajar|quantas pessoas estarão na viagem/i.test(showContent);
                            // Não renderiza BudgetUi/GroupSizeUi junto ao roteiro final
                            const isFinalRoteiro = msg.ui === 'final' && msg.role === 'assistant';
                            if (msg.role === 'user') {
                                return (
                                    <div className="flex w-full mt-2 justify-end" key={`user-${index}`}> 
                                        <div className="bg-primary text-white px-4 py-2 rounded-lg text-right" style={{marginLeft: 'auto', maxWidth: '70%', minWidth: '64px', wordBreak: 'break-word'}}>
                                            {showContent}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="flex w-full mt-2 justify-start" key={`ai-${index}`}> 
                                        <div className="bg-gray-100 text-black px-4 py-2 rounded-lg text-left" style={{marginRight: 'auto', maxWidth: '70%', minWidth: '64px', wordBreak: 'break-word'}}>
                                            {showContent}
                                            {!isFinalRoteiro && isBudget && <BudgetUi onSelectedOption={(v: string) => onSend(v)} />}
                                            {!isFinalRoteiro && isGroup && <GroupSizeUi onSelectedOption={(v: string) => onSend(v)} />}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        {/* Mensagem de loading */}
                        {/* Se for final, mostra FinalUi durante o loading */}
                        {loading && isFinal ? (
                            <div className="flex w-full mt-2 justify-start" key="final-ui-loading">
                                <div className="bg-gray-100 text-black px-4 py-2 rounded-lg text-left" style={{marginRight: 'auto', maxWidth: '70%', minWidth: '64px'}}>
                                    <FinalUi viewTrip={() => {}} tripDetail={tripDetail} />
                                </div>
                            </div>
                        ) : loading && (
                            <div className="flex w-full mt-2 justify-start" key="loading">
                                <div className="bg-gray-100 text-black px-4 py-2 rounded-lg text-left" style={{marginRight: 'auto', maxWidth: '70%', minWidth: '64px'}}>
                                    <Loader className='animate-spin h-4 w-4'/>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
            </section>
            {/* Input do usuário */}
            <section className="flex justify-center w-full">
                <div className="border rounded-2xl p-4 shadow w-full max-w-2xl relative">
                    <Textarea
                        placeholder="Escreva aqui..."
                        className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
                        onChange={(event) => setUserInput(event.target.value)}
                        value={userInput}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                    />
                    <Button size={'icon'} className="absolute bottom-6 right-6" onClick={() => onSend()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </section>
        </div>
    )
})

ChatBox.displayName = 'ChatBox'

export default ChatBox