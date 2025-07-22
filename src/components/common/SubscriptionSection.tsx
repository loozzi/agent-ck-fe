import { useAppDispatch, useAppSelector } from "@/app/hook"
import { fetchSubscriptionPricings } from "@/slices/subscription.slice"
import { useEffect } from "react"

const SubscriptionSection = () => {
  const dispatch = useAppDispatch()
  const { listPricings, isLoading, error } = useAppSelector((state) => state.subscription)

  useEffect(() => {
    dispatch(fetchSubscriptionPricings())
  }, [dispatch])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      Subscription Pricing
    </div>
  )
}

export default SubscriptionSection