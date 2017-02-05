defmodule SummerSinger.Repo do
  use Ecto.Repo, otp_app: :summer_singer

  def multi_changesets(changesets, opts \\ []) do
    changesets
    |> Enum.reduce(Ecto.Multi.new, fn(cset, multi) ->
      case cset.action do
        :update ->
          Ecto.Multi.update(multi, Ecto.UUID.generate, cset, opts)
        _ ->
          Ecto.Multi.insert(multi, Ecto.UUID.generate, cset, opts)
      end
    end)
    |> SummerSinger.Repo.transaction()
  end
end
