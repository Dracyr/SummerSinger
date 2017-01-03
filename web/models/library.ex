defmodule SummerSinger.Library do
  use SummerSinger.Web, :model

  schema "libraries" do
    field :path, :string
    field :title, :string

    has_many :folders, Folder

    timestamps()
  end

  @allowed_fields ~w(path title)

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_fields)
    |> validate_required([:path, :title])
  end

  def find_or_create!(path) do
    library = Repo.one from l in Library,
      where: l.path == ^path

    if is_nil(library) do
      %Library{}
      |> Library.changeset(%{path: path, title: Path.basename(path)})
      |> Repo.insert!
    else
      library
    end
  end
end
